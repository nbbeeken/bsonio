# Bench

## deep

### BSON.deserialize

- `iter   10000`
- `avg    0.0533ms`
- `stddev 0.03`
- `mode   0.0487ms`
- `median 0.0490ms`

### BSONDocument.from

- `iter   10000`
- `avg    0.0031ms`
- `stddev 0.05`
- `mode   0.0015ms`
- `median 0.0015ms`

#### BSONDocument.from.toRecord

- `iter   10000`
- `avg    0.0059ms`
- `stddev 0.02`
- `mode   0.0045ms`
- `median 0.0046ms`

## flat

### BSON.deserialize

- `iter   10000`
- `avg    0.0976ms`
- `stddev 0.04`
- `mode   0.0944ms`
- `median 0.0935ms`

### BSONDocument.from

- `iter   10000`
- `avg    0.0792ms`
- `stddev 0.03`
- `mode   0.0743ms`
- `median 0.0747ms`

### BSONDocument.from.toRecord

- `iter   10000`
- `avg    0.1792ms`
- `stddev 0.05`
- `mode   0.1702ms`
- `median 0.1698ms`

## full

### BSON.deserialize

- `iter   10000`
- `avg    0.0772ms`
- `stddev 0.04`
- `mode   0.0733ms`
- `median 0.0735ms`

### BSONDocument.from

- `iter   10000`
- `avg    0.0549ms`
- `stddev 0.02`
- `mode   0.0510ms`
- `median 0.0511ms`

### BSONDocument.from.toRecord

- `iter   10000`
- `avg    0.1448ms`
- `stddev 0.04`
- `mode   0.1370ms`
- `median 0.1382ms`
