# SoNAR (IDH) Visualization Prototypes
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


## About
This repository is a collection of experimental prototypes and the final project results developed in the DFG-funded project [SoNAR(IDH)](http://sonar.fh-potsdam.de/).

## Experimental prototypes
The visualization concepts in SoNAR(IDH) were developed iteratively and included many small and experimental prototypes that were not created with the approach the data, open up new pathways, to find problems or challenges with the data, or to communicate with our project partners and domain experts for historical network analysis. The following list displays and links to code of selected results:

### 01: Unfolding Edges
<img src="/img/03.jpg" width="150" heigth="150">
https://sonar.fh-potsdam.de/demos/03_unfoldingLinks.html


### Prototype 2
...

## Final project prototype
The finalized prototype is a first attempt to combine the SoNAR (IDH) project results inside one functional prototype.
### Data analysis
...
### The web-based interactive visualization interface
...



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
d3.v5.min.js → [D3.js](https://d3js.org/)  
jquery.min.js → [jQuery](https://jquery.com/)  


## Related publications
[Bludau, M.-J., Dörk, M., & Tominski, C. (2021). Unfolding Edges for Exploring Multivariate Edge Attributes in Graphs. https://doi.org/10.2312/evp20211070](https://diglib.eg.org/bitstream/handle/10.2312/evp20211070/017-019.pdf)

[Bludau, M.-J., Dörk, M., Fangerau, H., Halling, T., Leitner, E., Menzel, S., Müller, G., Petras, V., Rehm, G., Neudecker, C., Zellhöfer, D., & Moreno Schneider, J. (2020). SoNAR (IDH): Datenschnittstellen für historische Netzwerkanalyse. In C. Schöch (Hrsg.), DHd 2020 Spielräume: Digital Humanities zwischen Modellierung und Interpretation. Konferenzabstracts. Tagung des Verbands Digital Humanities, Paderborn, Germany (S. 360–362). Verband Digital Humanities im deutschsprachigen Raum e.V.](https://uclab.fh-potsdam.de/wp/wp-content/uploads/bludau2020sonaridh.pdf)

[Menzel, S., Bludau, M.-J., Leitner, E., Dörk, M., Moreno-Schneider, J., Petras, V. and Rehm, G. (accepted). Graph Technologies for the Analysis of Historical Social Networks Using Heterogeneous Data Sources. In Proceedings of Graph Technologies in the Humanities 2019 and 2020. Graph Technologies in the Humanities 2020. Vienna, AU: CEUR Workshop Proceedings.](https://markjanbludau.de/publications/GraphProceedings2019.pdf)


## License
The source code is licensed under ...
