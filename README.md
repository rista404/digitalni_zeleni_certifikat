# Tiny CLI to fetch Serbian vaccination info from euprava.gov.rs

CLI written in Deno using zbar webassembly module to find QR code in an image. After selecting a screenshot of the Serbian Digital green certificate QR code, the CLI will print personal and vaccination info in the terminal.

I might develop this further to generate an Apple Wallet pass, let's see!

To run, install [Deno](https://deno.land) and run `deno run --allow-read --allow-net server.ts --file screenshot.png`


> Конзолна апликација која повлачи дигитални зелени сертификат (потврду о вакцинацији) са Еуправе.