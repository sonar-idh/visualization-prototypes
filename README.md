# SoNAR (IDH) Visualization Prototypes
## About
This repository is a collection of experimental prototypes and the final project results developed in the DFG-funded project [SoNAR(IDH)](http://sonar.fh-potsdam.de/).

<p float="left">
<img src="/img/01.jpg" width="150" heigth="150">
<img src="/img/02.jpg" width="150" heigth="150">
<img src="/img/03.jpg" width="150" heigth="150">
<img src="/img/04.jpg" width="150" heigth="150">
<img src="/img/05.jpg" width="150" heigth="150">
<img src="/img/06.jpg" width="150" heigth="150">
<img src="/img/07.jpg" width="150" heigth="150">
<img src="/img/08.jpg" width="150" heigth="150">
<img src="/img/09.jpg" width="150" heigth="150">
<img src="/img/10.jpg" width="150" heigth="150">
<img src="/img/11.jpg" width="150" heigth="150">
<img src="/img/12.jpg" width="150" heigth="150">
<img src="/img/13.jpg" width="150" heigth="150">
<img src="/img/14.jpg" width="150" heigth="150">
<img src="/img/15.jpg" width="150" heigth="150">
<img src="/img/16.jpg" width="150" heigth="150">
<img src="/img/17.jpg" width="150" heigth="150">
<img src="/img/18.jpg" width="150" heigth="150">
</p>



## Data connection with database
The prototypes use a jquery AJAX request to connect with the neo4J database:

```javascript
$.ajax({
    url: "https://h2918680.stratoserver.net:7473/db/data/transaction/commit",
    type: 'POST',
    data: JSON.stringify({
      "statements": [{
          "statement": cypherStatement,
          "resultDataContents": ["graph"]
        }
      ],
    }),
    contentType: 'application/json',
    beforeSend: function(xhr) {
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(neo4jLogin + ':' + neo4jPassword));
    },
    accept: 'application/json; charset=UTF-8'
  }).done(function(data) {
  }
```

## External resources
d3.v5.min.js → [D3.js](https://d3js.org/): data-driven visualization library based on JavaScript
jquery.min.js → [jQuery](https://jquery.com/): JavaScript library
netClustering.js --> [netClustering](https://github.com/john-guerra/netClusteringJs): detects clusters in networks using the Clauset, Newman and Moore community detection algorithm


## Experimental prototypes
The visualization concepts in SoNAR(IDH) were developed iteratively and included many small and experimental prototypes that were not created with the approach the data, open up new pathways, to find problems or challenges with the data, or to communicate with our project partners and domain experts for historical network analysis. The following list displays and links to code of selected results:

### 01: Unfolding Edges
<img src="/img/03.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/03_unfoldingLinks.html">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/demo01">[Code]</a>


### 02: Uncertainty in links as oscillated lines
<img src="/img/04.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/04_uncertainty.html">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/demo02">[Code]</a>


### 03: Simple use of a community cluster algorithm
<img src="/img/05.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/05_clusterAlgorithm.html">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/demo03">[Code]</a>


### 04: Scrolling through time
<img src="/img/09.jpg" width="150" heigth="150">
[Demo][Code]

### 05: Temporal network cascade by communities
<img src="/img/11.jpg" width="150" heigth="150">
[Demo][Code]

### 06: Topic term by year using a voronoi diagram
<img src="/img/13.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/jul2020/jobs_by-year_voronoi.html">[Demo]</a>[Code]

### 07: Data exploration tool v.1
<img src="/img/14.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/jul2020/explorationstool_demo.html">[Demo]</a>[Code]

### 08: Morph between a graph and a timeline
<img src="/img/15.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/userstudy/timeline-morph.html">[Demo]</a>[Code]

### 09: Radial graph layout to visualize shared resources
<img src="/img/16.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/userstudy/ressource_focus.html">[Demo]</a>[Code]

### 10: Data exploration tool v.2
<img src="/img/17.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/userstudy/index_edges.html">[Demo]</a>[Code]


## Final project prototype
The finalized prototype is a first attempt to combine the SoNAR (IDH) project results inside one functional prototype.
### Data analysis
work in progress: here the repo for the data analysis used in the overview/entrance of the prototype will be linked and described

### The web-based interactive visualization interface
work in progress: here the repo for the final interactive visualization will be linked and described.

[Demo][Code]



## Related publications
[Bludau, M.-J., Dörk, M. & Tominski, C. (2021). Unfolding Edges for Exploring Multivariate Edge Attributes in Graphs. Poster at Eurographics Conference on Visualization (EuroVis), Zurich, Switzerland.  https://doi.org/10.2312/evp20211070](https://diglib.eg.org/bitstream/handle/10.2312/evp20211070/017-019.pdf)

[Bludau, M.-J., Dörk, M., Fangerau, H., Halling, T., Leitner, E., Menzel, S., Müller, G., Petras, V., Rehm, G., Neudecker, C., Zellhöfer, D., & Moreno Schneider, J. (2020). SoNAR (IDH): Datenschnittstellen für historische Netzwerkanalyse. In C. Schöch (Hrsg.), DHd 2020 Spielräume: Digital Humanities zwischen Modellierung und Interpretation. Konferenzabstracts. Tagung des Verbands Digital Humanities, Paderborn, Germany (S. 360–362). Verband Digital Humanities im deutschsprachigen Raum e.V.](https://uclab.fh-potsdam.de/wp/wp-content/uploads/bludau2020sonaridh.pdf)

[Menzel, S., Bludau, M.-J., Leitner, E., Dörk, M., Moreno-Schneider, J., Petras, V. and Rehm, G. (accepted). Graph Technologies for the Analysis of Historical Social Networks Using Heterogeneous Data Sources. In Proceedings of Graph Technologies in the Humanities 2019 and 2020. Graph Technologies in the Humanities 2020. Vienna, AU: CEUR Workshop Proceedings.](https://markjanbludau.de/publications/GraphProceedings2019.pdf)

## Credits

## License
The source code is licensed under ...
