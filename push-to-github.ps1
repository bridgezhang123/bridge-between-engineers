param(
    [switch]$SkipPush,
    [switch]$NoPrompt
)

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$historyPath = Join-Path $repoRoot "commit-history.txt"

function Get-PythonCommand {
    if (Get-Command python -ErrorAction SilentlyContinue) { return "python" }
    if (Get-Command py -ErrorAction SilentlyContinue) { return "py" }
    return $null
}

function Get-DefaultCommitMessage {
    $today = Get-Date -Format "yyyy-MM-dd"
    return "## $today update manufacturing_cnc-machining.md"
}

function Select-CommitMessage {
    param(
        [string[]]$History,
        [string]$DefaultMessage
    )

    $items = @($History | Select-Object -First 7)

    if ($items.Count -eq 0) {
        $userInput = Read-Host "No history available. Press Enter to use the default message [$DefaultMessage], or type a new commit message"
        if ([string]::IsNullOrWhiteSpace($userInput)) {
            return $DefaultMessage
        }
        return $userInput.Trim()
    }

    Write-Host "Recent commit messages:"
    for ($i = 0; $i -lt $items.Count; $i++) {
        Write-Host ("  [{0}] {1}" -f ($i + 1), $items[$i])
    }

    $userInput = Read-Host "Choose a recent message by number (1-$($items.Count)), press Enter to use [$DefaultMessage], or type a new commit message"
    if ([string]::IsNullOrWhiteSpace($userInput)) {
        return $DefaultMessage
    }

    $trimmed = $userInput.Trim()
    if ($trimmed -match '^[1-9][0-9]*$') {
        $index = [int]$trimmed - 1
        if ($index -ge 0 -and $index -lt $items.Count) {
            return $items[$index]
        }
    }

    return $trimmed
}

Set-Location $repoRoot

$history = @()
if (Test-Path $historyPath) {
    $history = Get-Content $historyPath | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
}

$defaultMessage = $history[0]
if ([string]::IsNullOrWhiteSpace($defaultMessage)) {
    $defaultMessage = Get-DefaultCommitMessage
}

if (-not $NoPrompt) {
    $message = Select-CommitMessage -History $history -DefaultMessage $defaultMessage

    if ([string]::IsNullOrWhiteSpace($message)) {
        Write-Host "Commit cancelled."
        exit 1
    }
} else {
    $message = $defaultMessage
    Write-Host "NoPrompt mode: using default commit message: $message"
}

$pythonCmd = Get-PythonCommand
if ($pythonCmd) {
    $scriptPath = Join-Path $repoRoot "scripts\generate_page_dates.py"
    if (Test-Path $scriptPath) {
        & $pythonCmd $scriptPath
    }
}

git add .

git commit -m $message

if (-not $SkipPush) {
    git push origin main
} else {
    Write-Host "Skipping push. Commit ready: $message"
}

$uniqueHistory = @($message) + @($history | Where-Object { $_ -ne $message })
$uniqueHistory = $uniqueHistory | Select-Object -First 10
$uniqueHistory | Set-Content -Encoding UTF8 $historyPath

Write-Host "Saved commit message history to: $historyPath"
Write-Host "Current commit message: $message"
