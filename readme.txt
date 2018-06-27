Tetris pro WebOS 

Emulátor

- požadavky : VirtualBox (=> 4.0), Java, 
- průvodce na instalaci - https://developer.palm.com/content/resources/develop/sdk_pdk_download.html

Spuštění aplikace

1, run emualator
2, install app - palm-install com.yourdomain.tetris_1.0.0_all
3, run app - palm-launch "Tetris"

Debug

- chrome, pro správnou funkčnost nutno změnit path knihovny a přidat parameter --disable-web-security
- palm-log -f "Tetris"


