npm install -g lighthouse
lighthouse http://localhost:3456 --output=json --output-path=docs/evidence/lighthouse-desktop.json --chrome-flags="--headless --no-sandbox"
