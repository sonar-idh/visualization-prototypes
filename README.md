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

netClustering.js → [netClustering](https://github.com/john-guerra/netClusteringJs): detects clusters in networks using the Clauset, Newman and Moore community detection algorithm

d3-weighted-voronoi.js and d3-voronoi-map.js → [d3-weighted-voronoi](https://github.com/Kcnarf/d3-weighted-voronoi) and [d3-voronoi-map](https://github.com/Kcnarf/d3-voronoi-map)

Google Fonts: Open Sans & Material Icons → [Open  Sans](https://fonts.google.com/), [Material Icons](https://fonts.googleapis.com/icon?family=Material+Icons)


## Experimental prototypes
The visualization concepts in SoNAR(IDH) were developed iteratively and included many small and experimental prototypes that were not created with the approach the data, open up new pathways, to find problems or challenges with the data, or to communicate with our project partners and domain experts for historical network analysis. For further details see the project documentation of AP3.
The following list displays and links to code of selected results (note: the code is not yet fully cleaned/commented):

### Visualization

#### Basic Unfolding Edges
<img src="/img/03.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/03_unfoldingLinks.html">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/experimental_prototypes/1_Visualization01_Basic-Unfolding-Edges">[Code]</a>

#### Uncertainty in links as oscillated lines
<img src="/img/04.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/04_uncertainty.html">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/experimental_prototypes/1_Visualization02_Uncertainty">[Code]</a>

#### Simple use of a community cluster algorithm
<img src="/img/05.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/05_clusterAlgorithm.html">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/experimental_prototypes/1_Visualization03_Community-Algorithm">[Code]</a>

#### Scrolling through time
<img src="/img/09.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/demo04/">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/experimental_prototypes/1_Visualization04_Scrolling-through-time">[Code]</a>

#### Temporal network cascade by communities
<img src="/img/11.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/demo05/">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/experimental_prototypes/1_Visualization05_Temporal-network-cascade">[Code]</a>

#### Racing Topic Term Bar Charts with Observable
<img src="/img/07_2.jpg" width="150" heigth="150">
<a href="https://observablehq.com/d/bddabca34f6d2e8b">[Demo/Code]</a>

#### Topic term by year using a voronoi diagram
<img src="/img/13.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/jul2020/jobs_by-year_voronoi.html">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/experimental_prototypes/1_Visualization07_Topic-Term-Voronoi">[Code]</a>

#### Morph between a graph and a timeline
<img src="/img/15.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/userstudy/timeline-morph.html">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/experimental_prototypes/1_Visualization08_Morph-from-Graph-to-Timeline">[Code]</a><a href="https://bl.ocks.org/markiaaan/285e5940a3ab07a8baf306cc562bba40">[Simplified Version with CSV Data (Code & Demo)]</a>


### Visualization + Interface

#### Radial graph layout to visualize shared resources
<img src="/img/16.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/userstudy/ressource_focus.html">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/experimental_prototypes/2_Interface01_Radial-Graph-for-Ressources">[Code]</a>

#### Data exploration tool
<img src="/img/17.jpg" width="150" heigth="150">
<a href="https://sonar.fh-potsdam.de/demos/userstudy/index_edges.html">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/experimental_prototypes/2_Interface02_Data-Exploration-Interface">[Code]</a>



## Final project prototype
The finalized prototype is a first attempt to combine the SoNAR (IDH) project results inside one functional prototype.
Building on the preceding prototyping process, different views were developed that allow exploration of the data from different perspectives and with a focus on a variety of data dimensions. The web-based visualization is thereby divided into two main components:

- A data overview entry, which allows researchers to get a sense of whether SoNAR might be relevant to their specific research field.
- Search-based views, which are based on targeted queries for an entity, provide different perspectives on the data and offer detailed filtering options.

Views have thus emerged that contrast a whole-data, accumulated overview view as an entry point with individual search-based views. Here, one starts from something small (a search query), and can expand it exploratively as needed.

<a href="https://sonar.fh-potsdam.de/prototype/">[Demo]</a><a href="https://github.com/sonar-idh/visualization-prototypes/tree/main/final_prototype">[Code]</a>

  ### Data Queries
  #### Search for Persons
  <img src="/img/query_PerName.jpg" >
    In order to be able to operate all filters in the visualization and also to filter further persons in the network according to TopicTerm or GeoName, for example, all links to TopicTerm, GeoName, etc. must also be queried for all persons connected with PerName (via SocialRelations and RelationToPerName). Currently, for performance reasons, only direct connections between the person searched for and other people are rendered in the prototype. However, this would only show connections from/to PerName1. To go beyond a first-person network and get a more accurate picture of the network with the structures and communities, one would also have to query all connections between all persons in the network that do not have to do with PerName1. However, this is currently a low performance query which also increases the complexity of the queries, which is why an optimization of the queries is necessary for future implementation.

  #### Search for Topic Terms
  <img src="/img/query_TopicTerm.jpg">
    In addition to the person search, a keyword search has been implemented, which makes some additional query additions necessary. Keywords (TopicTerms) can be directly linked to persons via the GND, but more often keywords are linked to resources (e.g. publications). For example, a book on a particular aspect of research is often tagged with a specific keyword, but the author of the book may not be. In order not to miss this richness of keywords, it is necessary to iterate over persons directly connected to the keyword as well as over persons indirectly connected via resources. In addition, as with the person search, all other node types must be queried for all persons in order to make the persons filterable, for example, according to corporate bodies or locations. Finally, it is important, especially for the keyword search, that all connections between the persons appearing in the network are retrieved, so that not only free-floating nodes are generated, but person networks are formed. All in all, this retrieval of data is time-intensive in the current implementation, especially for keywords with very many links. It remains to be examined whether this can be optimized. Furthermore, the described implemented search queries are only to be understood as exemplary implementations. In a further development of the concept, other node types (e.g. search for corporate bodies) and customizable searches (e.g. only a certain time period, minimum number of edges for displayed nodes) should be further considered.

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
