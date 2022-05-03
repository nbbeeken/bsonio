# BSON Bench

## Hardware
- cpu: Intel(R) Core(TM) i7-5960X CPU @ 3.00GHz
- cores: 16
- os: win32
- ram: 15.924522399902344GB
- iterations: 100

## Inputs

| name | bytes | top-level keys |
|-|-|-|
| adversarial  | 68 | -- |
| apache_builds  | 104185 | -- |
| blns  | 27630 | -- |
| canada  | 1794522 | -- |
| che-1.geo  | 17479 | -- |
| che-2.geo  | 17479 | -- |
| che-3.geo  | 17479 | -- |
| citm_catalog  | 479430 | -- |
| deep_bson  | 1966 | -- |
| demo  | 208 | -- |
| flat_bson  | 6046 | -- |
| flatadversarial  | 68 | -- |
| full_bson  | 4026 | -- |
| github_events  | 53635 | -- |
| google_maps_api_compact_response  | 12603 | -- |
| google_maps_api_response  | 12603 | -- |
| gsoc-2018  | 3078540 | -- |
| instruments  | 113904 | -- |
| marine_ik  | 3077782 | -- |
| mesh  | 894893 | -- |
| mesh.pretty  | 894893 | -- |
| numbers  | 138910 | -- |
| random  | 498964 | -- |
| repeat  | 5520 | -- |
| truenull  | 11895 | -- |
| twitter  | 444568 | -- |
| twitter_api_compact_response  | 9843 | -- |
| twitter_api_response  | 10683 | -- |
| twitter_timeline  | 38158 | -- |
| twitterescaped  | 444568 | -- |
| update-center  | 558419 | -- |


### Results - adversarial

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0693`ms | `0.3214` | `0.0116`ms | `0.0140`ms |
| 👨‍💻 entriesFromBSON | `0.0156`ms | `0.0653` | `0.0042`ms | `0.0043`ms |
| 👨‍💻 recurse entries | `0.0547`ms | `0.0365` | `0.0446`ms | `0.0449`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - apache_builds

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `2.8303`ms | `1.2119` | `2.8420`ms | `2.3634`ms |
| 👨‍💻 entriesFromBSON | `0.0168`ms | `0.0030` | `0.0160`ms | `0.0161`ms |
| 👨‍💻 recurse entries | `4.5026`ms | `1.3706` | `3.5967`ms | `3.9332`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - blns

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2776`ms | `0.0211` | `0.2737`ms | `0.2732`ms |
| 👨‍💻 entriesFromBSON | `0.0021`ms | `0.0017` | `0.0019`ms | `0.0019`ms |
| 👨‍💻 recurse entries | `0.4133`ms | `0.1080` | `0.3231`ms | `0.3919`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - canada

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `48.2784`ms | `10.9106` | `43.2629`ms | `43.3813`ms |
| 👨‍💻 entriesFromBSON | `0.0057`ms | `0.0173` | `0.0028`ms | `0.0028`ms |
| 👨‍💻 recurse entries | `250.9836`ms | `26.7244` | `243.2093`ms | `243.1791`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - che-1.geo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.4804`ms | `0.3485` | `0.3075`ms | `0.3241`ms |
| 👨‍💻 entriesFromBSON | `0.0042`ms | `0.0133` | `0.0023`ms | `0.0024`ms |
| 👨‍💻 recurse entries | `1.8607`ms | `0.2079` | `1.7988`ms | `1.7938`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - che-2.geo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.3582`ms | `0.0886` | `0.3085`ms | `0.3218`ms |
| 👨‍💻 entriesFromBSON | `0.0021`ms | `0.0018` | `0.0019`ms | `0.0019`ms |
| 👨‍💻 recurse entries | `1.8346`ms | `0.2635` | `1.7657`ms | `1.7612`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - che-3.geo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.3491`ms | `0.1053` | `0.3053`ms | `0.3146`ms |
| 👨‍💻 entriesFromBSON | `0.0021`ms | `0.0018` | `0.0019`ms | `0.0019`ms |
| 👨‍💻 recurse entries | `1.8804`ms | `0.3025` | `1.7402`ms | `1.7595`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - citm_catalog

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `18.4555`ms | `2.5605` | `17.5321`ms | `18.0496`ms |
| 👨‍💻 entriesFromBSON | `0.0084`ms | `0.0039` | `0.0078`ms | `0.0078`ms |
| 👨‍💻 recurse entries | `69.8358`ms | `13.1317` | `68.1808`ms | `65.7463`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - deep_bson

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0959`ms | `0.0272` | `0.0834`ms | `0.0839`ms |
| 👨‍💻 entriesFromBSON | `0.0030`ms | `0.0023` | `0.0027`ms | `0.0027`ms |
| 👨‍💻 recurse entries | `0.2063`ms | `0.0469` | `0.1639`ms | `0.2137`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - demo

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0089`ms | `0.0060` | `0.0082`ms | `0.0082`ms |
| 👨‍💻 entriesFromBSON | `0.0023`ms | `0.0035` | `0.0019`ms | `0.0019`ms |
| 👨‍💻 recurse entries | `0.0229`ms | `0.0089` | `0.0214`ms | `0.0214`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - flat_bson

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2707`ms | `0.0824` | `0.2543`ms | `0.2557`ms |
| 👨‍💻 entriesFromBSON | `0.0949`ms | `0.0065` | `0.0913`ms | `0.0924`ms |
| 👨‍💻 recurse entries | `0.1623`ms | `0.0198` | `0.1487`ms | `0.1524`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - flatadversarial

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.0058`ms | `0.0042` | `0.0053`ms | `0.0053`ms |
| 👨‍💻 entriesFromBSON | `0.0023`ms | `0.0018` | `0.0021`ms | `0.0020`ms |
| 👨‍💻 recurse entries | `0.0087`ms | `0.0045` | `0.0079`ms | `0.0080`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - full_bson

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.2724`ms | `0.1092` | `0.2415`ms | `0.2516`ms |
| 👨‍💻 entriesFromBSON | `0.1736`ms | `0.1373` | `0.0800`ms | `0.1504`ms |
| 👨‍💻 recurse entries | `0.2017`ms | `0.0623` | `0.1783`ms | `0.1793`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - github_events

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `1.0568`ms | `0.1030` | `0.9997`ms | `1.0271`ms |
| 👨‍💻 entriesFromBSON | `0.0311`ms | `0.0079` | `0.0297`ms | `0.0296`ms |
| 👨‍💻 recurse entries | `1.9081`ms | `0.8331` | `1.5800`ms | `1.4561`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - google_maps_api_compact_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.5615`ms | `0.1399` | `0.5032`ms | `0.5066`ms |
| 👨‍💻 entriesFromBSON | `0.0040`ms | `0.0019` | `0.0037`ms | `0.0037`ms |
| 👨‍💻 recurse entries | `1.1574`ms | `0.1877` | `1.0911`ms | `1.0983`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - google_maps_api_response

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `0.5273`ms | `0.0740` | `0.4545`ms | `0.5033`ms |
| 👨‍💻 entriesFromBSON | `0.0038`ms | `0.0022` | `0.0034`ms | `0.0034`ms |
| 👨‍💻 recurse entries | `1.1214`ms | `0.1750` | `1.0337`ms | `1.0918`ms |

Fastest: 👨‍💻 entriesFromBSON

### Results - gsoc-2018

| name | avg | stddev | mode | median |
|-|-|-|-|-|
| 🍃 BSON.deserialize | `25.0859`ms | `4.8055` | `21.9145`ms | `23.7486`ms |
| 👨‍💻 entriesFromBSON | `0.6010`ms | `0.2638` | `0.4681`ms | `0.4682`ms |
