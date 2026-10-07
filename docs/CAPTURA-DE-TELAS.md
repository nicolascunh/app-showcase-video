# Como capturar as telas do app

Qualquer origem serve; `npm run screens -- <app> arquivos…` ajusta ao aparelho (escala para cobrir
e corta o excesso pelo **rodapé**, preservando a barra de status).

Boas práticas: dados realistas e **sem informação pessoal real**, barra de status limpa (9:41, bateria cheia,
sinal completo), mesma proporção em todas as telas, sem teclado aberto, e uma tela por ideia do roteiro.

## iOS — Simulator (Mac)

```bash
xcrun simctl boot "iPhone 17 Pro Max"                      # se ainda não estiver aberto
xcrun simctl status_bar booted override --time 9:41 --batteryState charged --batteryLevel 100 --cellularBars 4 --wifiBars 3
xcrun simctl io booted screenshot ~/Desktop/prints/home.png
xcrun simctl status_bar booted clear
```

## Android — emulador ou aparelho (adb)

```bash
adb exec-out screencap -p > ~/Desktop/prints/home.png
```

Se o `adb` travar por conflito de porta (outro serviço usando a 5037), use outra porta: `ADB_SERVER_PORT=5038 adb …`.

## Flutter / React Native

Rode no simulador com os dados de demonstração e use um dos dois métodos acima. Em Flutter, `flutter screenshot`
também funciona.

## Figma

Exporte cada frame em **PNG @2x** no tamanho do aparelho (iPhone 17 Pro Max 880×1912, Pixel 10 Pro XL 896×1994,
genérico 840×1820), ou exporte maior e deixe o `npm run screens` ajustar.

## Depois de importar

Os arquivos ficam em `projects/<app>/public/screens/` com nome sem acento/espaço. Aponte cada um no campo `screen`
da cena e rode `npm run doctor -- <app>`.
