# Skyhawk Project Data Pipeline

This codebase contains scripts and tools that help:

- Preprocess
- Clean
- Deploy
  The GeoJSON dataset files that we have for the system.

### Usage

Simply run the following commands below to use any to the available scripts and tools.

### Required Binaries

1. jq - JSON preprocessor binary
2. MongoDB tools

### Install MongoDB Database Tools

Need for the import scripts to import data to mongoDB

```sh
brew install mongodb-database-tools
```

Install `jq` for extracting the features[] for each file geojson file.

```sh
brew install jq
```

## Data Pipelines

Implemented using Jupyter notebook

1. pipeline.ipynb

- Reads data from the "input-datasets" and "hazard-datasets" directory
- the directories should contain the geojson datasets from the Skyhawk project's Datasets Google Drive folder.
