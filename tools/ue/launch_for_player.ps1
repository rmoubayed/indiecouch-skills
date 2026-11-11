# Hands the game to the playtester: closes any game this project already has running, optionally builds, launches the
# game fullscreen at the player's resolution, brings it to the front, and removes the debug script once the map has
# loaded (so a stale script never drives the player's game). The game's paths come from its studio.json.
#   powershell -File tools/ue/launch_for_player.ps1 -Game <game folder> [-Build] [-ResX 3440] [-ResY 1440]
#     [-Script <file in the game's scripts folder>]   a setup script to run once (e.g. a showcase); omit for a normal start
param([Parameter(Mandatory = $true)][string]$Game, [switch]$Build, [int]$ResX = 3440, [int]$ResY = 1440, [string]$Script)
$cfg = Get-Content (Join-Path $Game "studio.json") -Raw | ConvertFrom-Json
$UE = $cfg.engine
$uproject = Join-Path $Game $cfg.uproject
$debugFile = Join-Path $Game $cfg.debugFile

# The player's open game locks assets and DLLs: close it first (only games of this project, never the editor).
Get-CimInstance Win32_Process -Filter "Name = 'UnrealEditor.exe'" |
  Where-Object { $_.CommandLine -match [regex]::Escape($cfg.uproject) -and $_.CommandLine -match '-game' } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }

if ($Build) {
  $out = & "$UE\Build\BatchFiles\Build.bat" $cfg.editorTarget Win64 Development "-Project=$uproject" -WaitMutex 2>&1
  $out | Select-String -Pattern " error |Result:" | ForEach-Object { $_.Line }
  if ($LASTEXITCODE -ne 0) { "BUILD FAILED: not launching"; exit 1 }
}
if ($cfg.stampBuild) { powershell -File (Join-Path $Game $cfg.stampBuild) | Out-Null }
if ($Script) { Copy-Item (Join-Path (Join-Path $Game $cfg.scripts) $Script) $debugFile -Force }
elseif (Test-Path $debugFile) { Remove-Item $debugFile -Force }

$g = Start-Process -FilePath "$UE\Binaries\Win64\UnrealEditor.exe" -ArgumentList "`"$uproject`"", $cfg.map, '-game', '-fullscreen',
  "-ResX=$ResX", "-ResY=$ResY", '-log' -PassThru

Add-Type @"
using System; using System.Runtime.InteropServices;
public static class Front {
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);
}
"@
# Wait for the game window, then bring it to the front (Windows refuses focus to a window that is still loading).
for ($i = 0; $i -lt 60; $i++) {
  Start-Sleep 2
  $p = Get-Process -Id $g.Id -ErrorAction SilentlyContinue
  if (-not $p) { "the game exited during load: read Saved/Logs"; exit 1 }
  if ($p.MainWindowHandle -ne 0 -and $i -ge 5) { [Front]::ShowWindow($p.MainWindowHandle, 3) | Out-Null; [Front]::SetForegroundWindow($p.MainWindowHandle) | Out-Null; break }
}
# The script is read when the map starts; remove it after so the next normal launch is clean.
Start-Sleep 20
if (Test-Path $debugFile) { Remove-Item $debugFile -Force }
"launched (pid $($g.Id)) at ${ResX}x$ResY"
