# BSON Bench

## Hardware
- cpu: Intel(R) Core(TM) i5-8279U CPU @ 2.40GHz
- cores: 8
- os: darwin
- ram: 16GB

## Results
| name | iter | avg | stddev | mode | median |
|-|-|-|-|-|-|
| 🍃 BSON.deserialize | `10000` | `0.0527`ms | `0.0329` | `0.0490`ms | `0.0490`ms |
| 👨‍💻 BSONDocument.from | `10000` | `0.0029`ms | `0.0235` | `0.0018`ms | `0.0018`ms |
| 👨‍💻 BSONDocument.from.toRecord | `10000` | `0.0074`ms | `0.0168` | `0.0061`ms | `0.0061`ms |
| 🍃 BSON.deserialize | `10000` | `0.0978`ms | `0.0342` | `0.0927`ms | `0.0931`ms |
| 👨‍💻 BSONDocument.from | `10000` | `0.0964`ms | `0.0325` | `0.0915`ms | `0.0915`ms |
| 👨‍💻 BSONDocument.from.toRecord | `10000` | `0.2167`ms | `0.0493` | `0.2056`ms | `0.2060`ms |
| 🍃 BSON.deserialize | `10000` | `0.0814`ms | `0.0432` | `0.0773`ms | `0.0775`ms |
| 👨‍💻 BSONDocument.from | `10000` | `0.0600`ms | `0.0176` | `0.0584`ms | `0.0583`ms |
| 👨‍💻 BSONDocument.from.toRecord | `10000` | `0.1773`ms | `0.0573` | `0.1685`ms | `0.1690`ms |
