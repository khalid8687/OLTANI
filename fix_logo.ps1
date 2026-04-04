Add-Type -AssemblyName System.Drawing

$inputPath = "c:\Users\Administrator\Desktop\OLTANI\src\assets\logo.png"
$outputPath = "c:\Users\Administrator\Desktop\OLTANI\src\assets\logo_clean.png"
$faviconPath = "c:\Users\Administrator\Desktop\OLTANI\public\favicon.png"

$img = New-Object System.Drawing.Bitmap($inputPath)
$w = $img.Width
$h = $img.Height

Write-Host "Processing $w x $h image..."

# Use Marshal for fast pixel access
$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$bmpData = $img.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$bytes = $bmpData.Stride * $h
$rgbValues = New-Object byte[] $bytes
[System.Runtime.InteropServices.Marshal]::Copy($bmpData.Scan0, $rgbValues, 0, $bytes)

$removed = 0
for ($i = 0; $i -lt $bytes; $i += 4) {
    $b = $rgbValues[$i]
    $g = $rgbValues[$i+1]
    $r = $rgbValues[$i+2]
    $a = $rgbValues[$i+3]
    
    if ($a -eq 0) { continue }
    
    $brightness = ($r + $g + $b) / 3
    $maxC = [Math]::Max([Math]::Max($r, $g), $b)
    $minC = [Math]::Min([Math]::Min($r, $g), $b)
    $diff = $maxC - $minC
    
    # Aggressive white/light removal - threshold 180
    if ($brightness -gt 180 -and $diff -lt 50) {
        $rgbValues[$i+3] = 0  # fully transparent
        $removed++
    }
    # Semi-transparent for borderline pixels
    elseif ($brightness -gt 150 -and $diff -lt 40) {
        $factor = ($brightness - 150) / 30.0
        $newAlpha = [int]([Math]::Round($a * (1 - $factor)))
        $rgbValues[$i+3] = [Math]::Max(0, $newAlpha)
        $removed++
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($rgbValues, 0, $bmpData.Scan0, $bytes)
$img.UnlockBits($bmpData)

Write-Host "Removed $removed white pixels"

# Save transparent logo
$img.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved transparent logo: $outputPath"

# Create favicon (64x64 with transparent background)
$favSize = 64
$fav = New-Object System.Drawing.Bitmap($favSize, $favSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$fg = [System.Drawing.Graphics]::FromImage($fav)
$fg.Clear([System.Drawing.Color]::Transparent)
$fg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$fg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$fg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$scale = [Math]::Min($favSize / $w, $favSize / $h) * 0.92
$fw = [int]($w * $scale)
$fh = [int]($h * $scale)
$fx = [int](($favSize - $fw) / 2)
$fy = [int](($favSize - $fh) / 2)
$fg.DrawImage($img, $fx, $fy, $fw, $fh)
$fg.Dispose()
$fav.Save($faviconPath, [System.Drawing.Imaging.ImageFormat]::Png)
$fav.Dispose()
Write-Host "Saved favicon: $faviconPath"

$img.Dispose()
Write-Host "DONE!"
