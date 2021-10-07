# SoNAR (IDH) Visualization Prototypes
## About
This repository is a collection of experimental prototypes and the final project results developed in the DFG-funded project [SoNAR(IDH)](http://sonar.fh-potsdam.de/).

- the visualizations are based on HTML, CSS and JavaScript using the visualization library D3.js
- while the overview view uses pre-processed data (see Data Analysis), the data for the search-based exploration is retrieved live (see below)
- currently, the prototype visualizations do not use frameworks for more modular DOM management. For a follow-up project we recommend the use of frameworks like Vue.js or Svelte to reduce maintenance effort
- currently the visualizations are mostly based on SVGs, in the future a switch to Canvas or WebGL would be advisable for performance reasons
- currently several queries are sent one after the other and then combined in the browser for the visualization. This leads to duplicates and multiple queried nodes, which slow down the processing and increase the amount of data. With more know-how regarding the production of specific complex queries, the performance could probably be improved significantly, at least in part


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

d3-weighted-voronoi.js and d3-voronoi-map.js --> [d3-weighted-voronoi](https://github.com/Kcnarf/d3-weighted-voronoi) and [d3-voronoi-map](https://github.com/Kcnarf/d3-voronoi-map)

Google Fonts: Open Sans & Material Icons --> [Open  Sans](https://fonts.google.com/) [Material Icons](https://fonts.googleapis.com/icon?family=Material+Icons)


## Experimental prototypes
The visualization concepts in SoNAR(IDH) were developed iteratively and included many small and experimental prototypes that were not created with the approach the data, open up new pathways, to find problems or challenges with the data, or to communicate with our project partners and domain experts for historical network analysis. The following list displays and links to code of selected results (note: the code is not yet fully cleaned/commented):

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
<a href="https://sonar.fh-potsdam.de/demos/demo04/">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/demo04">[Code]</a>

### 05: Temporal network cascade by communities
<img src="/img/11.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/demo05/">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/demo05">[Code]</a>

### 06: Topic term by year using a voronoi diagram
<img src="/img/13.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/jul2020/jobs_by-year_voronoi.html">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/demo06">[Code]</a>

### 07: Data exploration tool v.1
<img src="/img/14.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/jul2020/explorationstool_demo.html">[Demo]</a>[Code]

### 08: Morph between a graph and a timeline
<img src="/img/15.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/userstudy/timeline-morph.html">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/demo08">[Code]</a>


### 09: Radial graph layout to visualize shared resources
<img src="/img/16.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/userstudy/ressource_focus.html">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/demo09">[Code]</a>

### 10: Data exploration tool v.2
<img src="/img/17.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/userstudy/index_edges.html">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/demo10">[Code]</a>


## Final project prototype
The finalized prototype is a first attempt to combine the SoNAR (IDH) project results inside one functional prototype.
Building on the preceding prototyping process, different views were developed that allow exploration of the data from different perspectives and with a focus on a variety of data dimensions. The web-based visualization is thereby divided into two main components:

- A data overview entry, which allows researchers to get a sense of whether SoNAR might be relevant to their specific research field.
- Search-based views, which are based on targeted queries for an entity, provide different perspectives on the data and offer detailed filtering options.

Views have thus emerged that contrast a whole-data, accumulated overview view as an entry point with individual search-based views. Here, one starts from something small (a search query), and can expand it exploratively as needed.

[Demo](https://sonar.fh-potsdam.de/prototype/)[Code](https://github.com/sonar-idh/visualization-prototypes/tree/main/final_prototype)



## Related publications
[Bludau, M.-J., Dörk, M. & Tominski, C. (2021). Unfolding Edges for Exploring Multivariate Edge Attributes in Graphs. Poster at Eurographics Conference on Visualization (EuroVis), Zurich, Switzerland.  https://doi.org/10.2312/evp20211070](https://diglib.eg.org/bitstream/handle/10.2312/evp20211070/017-019.pdf)

[Bludau, M.-J., Dörk, M., Fangerau, H., Halling, T., Leitner, E., Menzel, S., Müller, G., Petras, V., Rehm, G., Neudecker, C., Zellhöfer, D., & Moreno Schneider, J. (2020). SoNAR (IDH): Datenschnittstellen für historische Netzwerkanalyse. In C. Schöch (Hrsg.), DHd 2020 Spielräume: Digital Humanities zwischen Modellierung und Interpretation. Konferenzabstracts. Tagung des Verbands Digital Humanities, Paderborn, Germany (S. 360–362). Verband Digital Humanities im deutschsprachigen Raum e.V.](https://uclab.fh-potsdam.de/wp/wp-content/uploads/bludau2020sonaridh.pdf)

[Menzel, S., Bludau, M.-J., Leitner, E., Dörk, M., Moreno-Schneider, J., Petras, V. and Rehm, G. (accepted). Graph Technologies for the Analysis of Historical Social Networks Using Heterogeneous Data Sources. In Proceedings of Graph Technologies in the Humanities 2019 and 2020. Graph Technologies in the Humanities 2020. Vienna, AU: CEUR Workshop Proceedings.](https://markjanbludau.de/publications/GraphProceedings2019.pdf)

## Credits
Part of the project SoNAR (IDH), a collobaration between Deutsches Forschungszentrum für Künstliche Intelligenz, FH Potsdam, Humboldt-Universität zu Berlin, Staatsbibliothek zu Berlin and Heinrich-Heine-Universität Düsseldorf.

Project partner responsible for the interface design and data visualization:
UCLAB, FH Potsdam – University of Applied Sciences
- Mark-Jan Bludau: concept development & coding
- Marian Dörk: project lead at FH Potsdam


## License
The source code is licensed under ...
