# GapTrack System

GapTrack is a web-based network coverage monitoring and visualization project. It helps users review connectivity gaps, inspect weak-coverage zones, and explore shipment tracking updates through an interactive dashboard.

> **Project status:** This repository contains the current development source. The PHP application is located in `artifacts/gaptrack/` and can be run locally with XAMPP. The included data can be used for demonstration; it does not connect to live GPS hardware or a real telecom coverage feed.

## Main application

The runnable PHP application is in:

```text
artifacts/gaptrack/
```

Its main components include:

- PHP application and page views
- MySQL integration using PDO
- Interactive frontend assets
- Coverage-gap zones, shipment tracking updates, and alerts
- Demo JSON data for local preview

## Run locally with XAMPP

1. Copy `artifacts/gaptrack/` into your XAMPP `htdocs` directory, for example:
   `C:\xampp\htdocs\gaptrack`
2. Start Apache and MySQL from the XAMPP Control Panel.
3. Create or select a MySQL database named `gaptrack` and import your project database schema/data if you have an SQL export.
4. Copy `config.local.example.php` to `config.local.php` inside the `gaptrack` folder.
5. Update the local database host, port, database name, username, and password in `config.local.php`.
6. Open `http://localhost/gaptrack/public/` in your browser.

For additional Arabic setup notes, see [`artifacts/gaptrack/README-LOCAL-AR.md`](artifacts/gaptrack/README-LOCAL-AR.md).

## Configuration and security

- Never commit `config.local.php`, `.env` files, database passwords, API keys, or other credentials.
- `config.local.example.php` is a safe template; use it to create your private local configuration.
- Use demo data unless you have permission to use real tracking or coverage data.

## Technology

- PHP
- MySQL / MariaDB
- HTML, CSS, and JavaScript
- Leaflet for map visualization (where configured)

## Disclaimer

GapTrack is a demonstration and development project. Map markers, coverage zones, and tracking records may be simulated or based on stored sample data. They should not be interpreted as live network measurements.
