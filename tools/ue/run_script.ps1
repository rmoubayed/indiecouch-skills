# Runs a debug script (timed console commands, one per line) in a standalone game with the editor closed, and files
# each "Shot" under the game's shots folder by the "# name" line before it. The game's paths come from its studio.json.
#   powershell -File tools/ue/run_script.ps1 -Game <game folder> -Script <file in the game's scripts folder> -Out <subfolder>
#     [-Build] [-ResX 1600] [-ResY 900]
param([Parameter(Mandatory = $true)][string]$Game, [Parameter(Mandatory = $true)][string]$Script, [Parameter(Mandatory = $true)][string]$Out,
  [switch]$Build, [int]$ResX = 1600, [int]$ResY = 900)
$cfg = Get-Content (Join-Path $Game "studio.json") -Raw | ConvertFrom-Json
$UE = $cfg.engine
$uproject = Join-Path $Game $cfg.uproject
if ($Build) {
  & "$UE\Build\BatchFiles\Build.bat" $cfg.editorTarget Win64 Development "-Project=$uproject" -WaitMutex 2>&1 | Select-String -Pattern " error |Result:" | ForEach-Object { $_.Line }
}
if ($cfg.stampBuild) { powershell -File (Join-Path $Game $cfg.stampBuild) | Out-Null }
$scriptPath = Join-Path (Join-Path $Game $cfg.scripts) $Script
$debugFile = Join-Path $Game $cfg.debugFile
Copy-Item $scriptPath $debugFile -Force
$dir = Join-Path $Game "Saved\Screenshots\WindowsEditor"
New-Item -ItemType Directory -Force (Join-Path $Game "Saved\Screenshots\old") | Out-Null
Get-ChildItem $dir -Filter *.png -ErrorAction SilentlyContinue | Move-Item -Destination (Join-Path $Game "Saved\Screenshots\old") -Force
$g = Start-Process -FilePath "$UE\Binaries\Win64\UnrealEditor.exe" -ArgumentList "`"$uproject`"", $cfg.map, '-game', '-windowed', "-ResX=$ResX", "-ResY=$ResY", '-log' -PassThru
$g.WaitForExit(1200000) | Out-Null
Remove-Item $debugFile -Force -ErrorAction SilentlyContinue
$names = @(); $last = ""
foreach ($l in Get-Content $scriptPath) { if ($l -match '^# (\S+)$') { $last = $Matches[1] } elseif ($l -match 'HighResShot|:\s*Shot') { $names += $last } }
$files = @(Get-ChildItem $dir -Filter *.png -ErrorAction SilentlyContinue | Sort-Object Name)
if ($files.Count -eq 0) { "no shots taken"; exit 1 }
$names = $names[($names.Count - $files.Count)..($names.Count - 1)]
$o = Join-Path (Join-Path $Game $cfg.shots) $Out; New-Item -ItemType Directory -Force $o | Out-Null
$i = 0; foreach ($f in $files) { Copy-Item $f.FullName (Join-Path $o "$($names[$i]).png"); $i++ }
"$i shots in $o"
