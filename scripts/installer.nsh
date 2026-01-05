!macro customInstall
  ; Add registry key for Run at startup
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Rosetta" "$INSTDIR\Rosetta.exe"
!macroend

!macro customUnInstall
  ; Remove registry key for Run at startup
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Rosetta"
!macroend
