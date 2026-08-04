!macro customInstall
  ; Add registry key for Run at startup
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Perch" "$INSTDIR\Perch.exe"
!macroend

!macro customUnInstall
  ; Remove registry key for Run at startup
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Perch"
!macroend
