var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

div.append("p")


////////////////////////////////////
////////////////////////////////////setup Network vis
const margin = 0;
let windowWidth = window.innerWidth - 2 * margin
let windowHeight = window.innerHeight - 2 * margin
let timelineHeight = 0.25 * windowHeight
let mode = "overview"

let timelinerelationsData = []
let timelineInterval = [1300, 2000]
let timelineMaxCount
let timelineMaxResourceCount
let timelineMaxEdgesCount

let timelineScale = d3.scaleLinear()
  .domain(timelineInterval)
  .range([0, windowWidth]);

let timelineYScale = d3.scaleLinear()
  .domain([0, 13000000])
  .range([timelineHeight, 0])




let areaGraphRelationAll = d3.area()
  .x(function(d, i) {
    return timelineScale(d.date);
  })
  .y0(function(d) {
    return timelineYScale(0)
  })
  .y1(function(d) {
    return timelineYScale(d.countPerson)
  })
  .curve(d3.curveBasis);


let areaGND = d3.area()
  .x(function(d, i) {
    return timelineScale(d.year);
  })
  .y0(function(d) {
    return timelineYScale(0)
  })
  .y1(function(d) {
    return timelineYScale(d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
  })
  .curve(d3.curveBasis);

let areaKPE = d3.area()
  .x(function(d, i) {
    return timelineScale(d.year);
  })
  .y0(function(d) {
    return timelineYScale(d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
  })
  .y1(function(d) {
    return timelineYScale(d.ResPer_KPE + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
  })
  .curve(d3.curveBasis);

let areaDNB = d3.area()
  .x(function(d, i) {
    return timelineScale(d.year);
  })
  .y0(function(d) {
    return timelineYScale(d.ResPer_KPE + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
  })
  .y1(function(d) {
    return timelineYScale(d.ResPer_DNB + d.ResPer_KPE + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
  })
  .curve(d3.curveBasis);

let areaSBB = d3.area()
  .x(function(d, i) {
    return timelineScale(d.year);
  })
  .y0(function(d) {
    return timelineYScale(d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
  })
  .y1(function(d) {
    return timelineYScale(d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
  })
  .curve(d3.curveBasis);


let areaZDB = d3.area()
  .x(function(d, i) {
    return timelineScale(d.year);
  })
  .y0(function(d) {
    return timelineYScale(d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
  })
  .y1(function(d) {
    return timelineYScale(d.ResPer_ZDB + d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
  })
  .curve(d3.curveBasis);

let areaComp = d3.area()
  .x(function(d, i) {
    return timelineScale(d.year);
  })
  .y0(function(d) {
    return timelineYScale(d.ResPer_ZDB + d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
  })
  .y1(function(d) {
    return timelineYScale(d.PerPer_Comp + d.CorpPer_Comp + d.ResPer_ZDB + d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
  })
  .curve(d3.curveBasis);

let brushTimelineX = d3.brushX()
  .extent([
    [0, 0],
    [windowWidth, timelineHeight]
  ]).on("brush", timelinebrushed)
  .on("end", timelinebrushed)

let brushStart = null
let brushEnd = null

const neo4jLogin = "neo4j" //'sonar';
const neo4jPassword = 'sonar2021';

function backToOverview() {
  mode = "overview"
  yearSelected = 1850

  window.location.hash = "#"
  d3.select(".cypher-in").attr("value", null)


  d3.selectAll(".axistime").remove()
  d3.select("#morphToTimeline").style("display", "block")
  d3.select("#morphToGraph").style("display", "none")
  d3.selectAll(".timelineRect").style("pointer-events", "auto")
  d3.selectAll(".timelineRect").classed("timelineRectSelected", function(d) {
    if (d == yearSelected) {
      return true
    } else {
      return false
    }
  })

  svgG.transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity);


  d3.select(".searchbar").style("display", "flex")
  d3.select("#svg").style("display", "block")
  d3.select("#add_search").style("opacity", 1)
  d3.select("#intro-text").style("display", "block")
  d3.select("#graph-info").style("display", "none")
  d3.select("#filterLists").style("display", "none")
  d3.select("#graph-metrics").style("display", "none")
  d3.select("#graph").style("display", "none")
  d3.select(".timelinebrush").style("display", function() {
    if (mode == "overview") {
      return "none"
    } else {
      return "block"
    }
  })


  ////////////
  //////backtooverview timeline update
  timelineInterval = [1300, 2000]

  /////timelineStart
  timelineScale = d3.scaleLinear()
    .domain(timelineInterval)
    .range([0, windowWidth]);

  timelineYScale = d3.scaleLinear()
    .domain([0, 13000000])
    .range([timelineHeight, 0])

  areaGND = d3.area()
    .x(function(d, i) {
      return timelineScale(d.year);
    })
    .y0(function(d) {
      return timelineYScale(0)
    })
    .y1(function(d) {
      return timelineYScale(d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
    })
    .curve(d3.curveBasis);

  areaKPE = d3.area()
    .x(function(d, i) {
      return timelineScale(d.year);
    })
    .y0(function(d) {
      return timelineYScale(d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
    })
    .y1(function(d) {
      return timelineYScale(d.ResPer_KPE + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
    })
    .curve(d3.curveBasis);

  areaDNB = d3.area()
    .x(function(d, i) {
      return timelineScale(d.year);
    })
    .y0(function(d) {
      return timelineYScale(d.ResPer_KPE + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
    })
    .y1(function(d) {
      return timelineYScale(d.ResPer_DNB + d.ResPer_KPE + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
    })
    .curve(d3.curveBasis);

  areaSBB = d3.area()
    .x(function(d, i) {
      return timelineScale(d.year);
    })
    .y0(function(d) {
      return timelineYScale(d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
    })
    .y1(function(d) {
      return timelineYScale(d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
    })
    .curve(d3.curveBasis);


  areaZDB = d3.area()
    .x(function(d, i) {
      return timelineScale(d.year);
    })
    .y0(function(d) {
      return timelineYScale(d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
    })
    .y1(function(d) {
      return timelineYScale(d.ResPer_ZDB + d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
    })
    .curve(d3.curveBasis);

  areaComp = d3.area()
    .x(function(d, i) {
      return timelineScale(d.year);
    })
    .y0(function(d) {
      return timelineYScale(d.ResPer_ZDB + d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
    })
    .y1(function(d) {
      return timelineYScale(d.PerPer_Comp + d.CorpPer_Comp + d.ResPer_ZDB + d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
    })
    .curve(d3.curveBasis);




  d3.select("#timelineselectedyear").text(timelineInterval[0] + "—" + timelineInterval[1])
  d3.select("#timelinetitlecategory").text("Personen")

  d3.selectAll(".axisRectangles").selectAll(".timelineRect")
    .transition()
    .attr("width", timelineScale(timelineInterval[0] + 50) - timelineScale(timelineInterval[0])) //breite für 50 Jahre
    .attr("x", function(d) {
      return timelineScale(d)
    })

  d3.selectAll(".axisRectangles").selectAll("text")
    .transition()
    .attr("x", function(d) {
      return timelineScale(d)
    })

  d3.selectAll(".areachartGroup").selectAll("path").remove()


  let areachart = d3.selectAll(".areachartGroup")


  areachart.append("path")
    .datum(timelinerelationsData)
    .attr("d", areaGND)
    .style("fill", colorScaleEdges("GND"))
    .style("opacity", 1)
    .style("stroke", "white")
    .style("stroke-width", 1)
    .attr("class", "overviewareaGND")

  areachart.append("path")
    .datum(timelinerelationsData)
    .attr("d", areaKPE)
    .style("fill", colorScaleEdges("KPE"))
    .style("opacity", 1)
    .style("stroke", "white")
    .style("stroke-width", 1)
    .attr("class", "overviewareaKPE")

  areachart.append("path")
    .datum(timelinerelationsData)
    .attr("d", areaDNB)
    .style("fill", colorScaleEdges("DNB"))
    .style("opacity", 1)
    .style("stroke", "white")
    .style("stroke-width", 1)
    .attr("class", "overviewareaDNB")

  //
  areachart.append("path")
    .datum(timelinerelationsData)
    .attr("d", areaSBB)
    .style("fill", colorScaleEdges("SBB"))
    .style("opacity", 1)
    .style("stroke", "white")
    .style("stroke-width", 1)
    .attr("class", "overviewareaSBB")

  areachart.append("path")
    .datum(timelinerelationsData)
    .attr("d", areaZDB)
    .style("fill", colorScaleEdges("ZDB"))
    .style("opacity", 1)
    .style("stroke", "white")
    .style("stroke-width", 1)
    .attr("class", "overviewareaZDB")

  areachart.append("path")
    .datum(timelinerelationsData)
    .attr("d", areaComp)
    .style("fill", colorScaleEdges("Comp")) //"url(#diagonalHatch)")
    .style("opacity", 1)
    .style("stroke", "white")
    .style("stroke-width", 1)
    .attr("class", "overviewareaComp")

  ////////////
  //////backtooverview timeline update Ende




}

function setupNeo4jLoginForAjax(login, passwd) {
  $.ajaxSetup({
    contentType: 'application/json',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa(login + ':' + passwd));
    }
  });
}

$(function() {
  setupNeo4jLoginForAjax(neo4jLogin, neo4jPassword);

});

let maxValueinLinks = 1
let maxValueinNodes = 1

let nodes = [],
  links = [];
let graph = {
  nodes: nodes,
  links: links
};

let linksClean = []

let timeline = []
let newNode = false
let queryCollection = []

if (window.location.hash) {
  console.log(window.location.hash.split("#"))
  let hashId = window.location.hash.split("#")[1]
  d3.select(".cypher-in").attr("value", hashId)
  post_cypherquery('execute')
}



function post_cypherquery(type, id) {
  mode = "graph"
  d3.select("#svg").style("display", "none")
  d3.select("#add_search").style("opacity", 1)
  d3.select("#intro-text").style("display", "none")
  d3.select("#graph-info").style("display", "block")
  d3.select("#filterLists").style("display", "block")
  d3.select("#graph-metrics").style("display", "block")
  d3.select("#graph").style("display", "block")
  d3.select(".timelinebrush").style("display", function() {
    if (mode == "overview") {
      return "none"
    } else {
      return "block"
    }
  })

  let cypherStatement
  let cypherStatement2
  let cypherStatement3
  let cypherStatement4

  let searchquery = $('#suche').val()

  if (type == "execute" || type == "addByQuery") {
    d3.select("#load").style("display", "block");
    d3.select("#loadbg").style("display", "block");

    queryCollection.push(searchquery)


    if ($('#search_category_select').val() == "GND-ID") {

      if (type == "execute") {
        window.location.hash = "#" + searchquery
      }
      // cypherStatement = `MATCH (p:PerName {Id:'${searchquery}'}) WITH p
      //                   MATCH (p)--(friends:PerName)-[r2]-(n:PerName)--(p)
      //                   WHERE (ID(friends) > ID(n))
      //                   RETURN DISTINCT*`
      // `MATCH (p:PerName {Id:'${searchquery}'}) WITH p
      //                   MATCH (p)-[rel:RelationToPerName|SocialRelation]-(friends:PerName)-[rel2:RelationToPerName|SocialRelation]-(n:PerName)-[rel3:RelationToPerName|SocialRelation]-(p)
      //                   WHERE (ID(friends) > ID(n))
      //                   RETURN DISTINCT* LIMIT 150000`
      //

      cypherStatement =
        `MATCH (p:PerName) - [rel:RelationToPerName | RelationToCorpName | SocialRelation] - (friends) - [rel2:RelationToTopicTerm | RelationToGeoName | RelationToMeetName | RelationToUniTitle | RelationToCorpName ] - (friendsfriends)
                        WHERE (p.Id = "${searchquery}" AND friends:PerName)
                        RETURN DISTINCT*`

      cypherStatement2 =
        `MATCH (p:PerName) - [rel:RelationToTopicTerm | RelationToGeoName | RelationToCorpName | RelationToMeetName | RelationToUniTitle | SocialRelation | RelationToResource | RelationToPerName] - (friends)
                                          WHERE (p.Id = "${searchquery}")
                                          RETURN DISTINCT*`

      cypherStatement3 =
        `MATCH (p:PerName) - [rel:RelationToResource | RelationToPerName] - (friends)
      - [rel2:RelationToPerName | RelationToResource] - (friendsfriends)
                                                            WHERE (p.Id = "${searchquery}" )
                                                            RETURN DISTINCT*`

      if ($('#search_type_select').val() == "complex") {
        cypherStatement4 =
          `MATCH (p:PerName {Id:'${searchquery}'}) WITH p
                         MATCH (p)--(friends:PerName)-[r2]-(n:PerName)--(p)
                         WHERE (ID(friends) > ID(n))
                         RETURN DISTINCT r2`
      } else {
        cypherStatement4 = ``
      }
    } else if ($('#search_category_select').val() == "Schlagwort") {



      cypherStatement = `MATCH (t:TopicTerm) - [rel:RelationToPerName|RelationToResource|RelationToGeoName|RelationToTopicTerm|SocialRelation] - (friends) -  [rel2:RelationToTopicTerm | RelationToGeoName | RelationToCorpName | RelationToMeetName | RelationToUniTitle] - (friendsfriends)
WHERE (t.Name CONTAINS "${searchquery}" AND friends:PerName )
RETURN * `
      //
      // cypherStatement2 = `MATCH (t:TopicTerm) -- (r:Resource ) - [rel:RelationToPerName] - (p:PerName) - [rel2:RelationToPerName] - (p2:PerName) -- (t:TopicTerm)
      //   WHERE (t.Name CONTAINS "${searchquery}")
      //   RETURN * `
      //

      cypherStatement2 = `MATCH (t:TopicTerm)-[rel1]-(p:PerName)-[rel2]-(p2:PerName)--(t:TopicTerm)
  WHERE (t.Name CONTAINS '${searchquery}') AND ID(p) > ID(p2)
  RETURN *`

      cypherStatement3 = `MATCH (t:TopicTerm)-[rel1]-(r:Resource)-[rel3:RelationToPerName]-(p:PerName)-[rel2]-(p2:PerName)--(r:Resource)
    WHERE (t.Name CONTAINS '${searchquery}') AND ID(p) > ID(p2)
    RETURN *`



    }

  } else if (type == "addByNode") {
    queryCollection.push(id)

    cypherStatement =
      `MATCH (p:PerName) - [rel:RelationToPerName | RelationToCorpName | SocialRelation] - (friends) - [rel2:RelationToTopicTerm | RelationToGeoName | RelationToMeetName | RelationToUniTitle | RelationToCorpName] - (friendsfriends)
                      WHERE (p.Id = "${id}" AND friends:PerName)
                      RETURN DISTINCT* LIMIT 10000`

    cypherStatement2 =
      `MATCH (p:PerName) - [rel:RelationToTopicTerm | RelationToGeoName | RelationToCorpName | RelationToMeetName | RelationToUniTitle | SocialRelation | RelationToResource | RelationToPerName] - (friends)
                                        WHERE (p.Id = "${id}")
                                        RETURN DISTINCT* LIMIT 10000`

    cypherStatement3 =
      `MATCH (p:PerName) - [rel:RelationToResource | RelationToPerName] - (friends) - [rel2:RelationToPerName | RelationToResource] - (friendsfriends)
                                                          WHERE (p.Id = "${id}" )
                                                          RETURN DISTINCT* LIMIT 10000`

    if ($('#search_type_select').val() == "complex") {
      cypherStatement4 =
        `MATCH (p:PerName {Id:'${searchquery}'}) WITH p
                       MATCH (p)--(friends:PerName)-[r2]-(n:PerName)--(p)
                       WHERE (ID(friends) > ID(n))
                       RETURN DISTINCT r2`
    } else {
      cypherStatement4 = ``
    }

  }





  $.ajax({
      url: "http://localhost:7474/db/data/transaction/commit", //"https://h2918680.stratoserver.net:7473/db/data/transaction/commit",
      type: 'POST',
      data: JSON.stringify({
        "statements": [{
            "statement": cypherStatement,
            "resultDataContents": ["graph"]
          }, {
            "statement": cypherStatement2,
            "resultDataContents": ["graph"]
          },
          {
            "statement": cypherStatement3,
            "resultDataContents": ["graph"]
          },
          {
            "statement": cypherStatement4,
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

      console.log(data)


      if (type == "execute") {
        nodes = []
        links = []
        linksClean = []
        graph = {
          nodes: nodes,
          links: links
        };
        timeline = []
        newNode = false


      } else {
        newNode = true
      }




      data.results.forEach(function(statement) {
        statement.data.forEach(function(row) {
          row.graph.nodes.forEach(function(n) {
            if (idIndex(nodes, n.id) == null) {

              if (n.labels[0] == "ChronTerm") {
                nodes.push({
                  id: n.id,
                  Id: n.properties.Id,
                  Label: n.labels[0],
                  Name: n.properties.Name,
                  //EntityGenType:n.properties.EntityGenType,
                  //EntitySpecType:n.properties.EntitySpecType,
                  VariantName: n.properties.VariantName,
                  connectivity: 0,
                  connectivityPerCorp: 0,
                  newState: newNode

                })
              } else if (n.labels[0] == "PerName" || n.labels[0] == "TopicTerm" || n.labels[0] == "CorpName" || n.labels[0] == "GeoName" || n.labels[0] == "MeetName" || n.labels[0] == "UniTitle") {

                nodes.push({
                  Name: n.properties.Name,
                  Title: n.properties.Title,
                  VariantName: n.properties.VariantName,
                  id: n.id,
                  Id: n.properties.Id,
                  n4jID: n.properties.id,
                  Label: n.labels[0],
                  GenType: n.properties.GenType,
                  GenSubdiv: n.properties.GenSubdiv,
                  SpecType: n.properties.SpecType,
                  Genre: n.properties.Genre,
                  SourcePath: n.properties.SourcePath,
                  Medium: n.properties.Medium,
                  SubUnit: n.properties.SubUnit,
                  Gender: n.properties.Gender,
                  Place: n.properties.Place,
                  GeoArea: n.properties.GeoArea,
                  Coordinates: n.properties.Coordinates,
                  IdGeonames: n.properties.IdGeonames,
                  Info: n.properties.Info,
                  DateOriginal: n.properties.DateOriginal,
                  DateApproxOriginal: n.properties.DateApproxOriginal,
                  DateApproxBegin: n.properties.DateApproxBegin,
                  DateApproxEnd: n.properties.DateApproxEnd,
                  DateApproxBegin2: (n.properties.DateApproxBegin != undefined && isNaN(n.properties.DateApproxBegin) != true) ? n.properties.DateApproxBegin : 0,
                  DateApproxEnd2: n.properties.DateApproxEnd,
                  DateStrictBegin: n.properties.DateStrictBegin,
                  DateStrictEnd: n.properties.DateStrictEnd,
                  Uri: n.properties.Uri,
                  connectivity: 0,
                  connectivityPerCorp: 0,
                  connectivityClean: 0,
                  newState: newNode

                })

                let dateStart = n.properties.DateApproxBegin
                let dateEnd = n.properties.DateApproxEnd

                if (dateStart != null && dateEnd != null && n.labels[0] == "PerName") {
                  for (x = Number(new Date(dateStart).getFullYear()); x <= Number(new Date(dateEnd).getFullYear()); x++) {
                    if (timeline[x]) {
                      timeline[x]["countPerson"]++
                    } else {
                      timeline[x] = {},
                        timeline[x]["date"] = x,
                        timeline[x]["countPerson"] = 1,
                        timeline[x]["countResource"] = 0,
                        timeline[x]["countEdge"] = 0

                    }
                  }
                }



              } else if (n.labels[0] == "Resource") {

                let dateStart = n.properties.DateApproxBegin
                let dateEnd = n.properties.DateApproxEnd
                let dateStartYear
                let dateEndYear


                if (dateStart !== undefined) {
                  if (dateStart.length == 4) {
                    dateStartYear = dateStart
                  } else if (dateStart.indexOf("-") != -1) {
                    dateStartYear = dateStart.split("-")[0]
                  } else if (dateStart.length == 8) {
                    dateStartYear = dateStart.slice(0, 4)
                  } else if (dateStart.indexOf("[") != -1) {
                    dateStartYear = dateStart.slice(1, 5)
                  } else {
                    dateStartYear = undefined
                  }
                }

                if (dateEnd && dateEnd !== null) {
                  if (dateEnd.length == 4) {
                    dateEndYear = dateEnd
                  } else if (dateEnd.indexOf("-") != -1) {
                    dateEndYear = dateEnd.split("-")[0]
                  } else if (dateEnd.length == 8) {
                    dateEndYear = dateEnd.slice(0, 4)
                  } else if (dateEnd.indexOf("[") != -1) {
                    dateEndYear = dateEnd.slice(1, 5)
                  } else {
                    dateEndYear = undefined
                  }
                }

                nodes.push({
                  id: n.id,
                  Id: n.properties.Id,
                  n4jID: n.properties.id,
                  Label: n.labels[0],
                  Name: (n.properties.Title != null) ? n.properties.Title : n.properties.Name,
                  VariantName: n.properties.VariantName,
                  Genre: n.properties.Genre,
                  Creator: n.properties.Creator,
                  Lang: n.properties.Lang,
                  GenType: n.properties.GenType,
                  GenSubdiv: n.properties.GenSubdiv,
                  SpecType: n.properties.SpecType,
                  Genre: n.properties.Genre,
                  SourcePath: n.properties.SourcePath,
                  Medium: n.properties.Medium,
                  SubUnit: n.properties.SubUnit,
                  Gender: n.properties.Gender,
                  Place: n.properties.Place,
                  GeoArea: n.properties.GeoArea,
                  Coordinates: n.properties.Coordinates,
                  IdGeonames: n.properties.IdGeonames,
                  Info: n.properties.Info,
                  DateOriginal: n.properties.DateOriginal,
                  DateApproxOriginal: n.properties.DateApproxOriginal,
                  DateApproxBegin: n.properties.DateApproxBegin,
                  DateApproxEnd: n.properties.DateApproxEnd,
                  DateStrictBegin: n.properties.DateStrictBegin,
                  DateStrictEnd: n.properties.DateStrictEnd,
                  DateApproxBegin2: (dateStartYear != undefined) ? dateStartYear : 0,
                  DateApproxEnd2: dateEndYear,
                  ResourcePublPlace: n.properties.ResourcePublPlace,
                  Uri: n.properties.Uri,
                  connectivity: 0,
                  connectivityPerCorp: 0,
                  newState: newNode
                })

                ////////////////////////






                if (dateStartYear != null && dateStartYear != undefined && dateEndYear != null && dateEndYear != undefined) {
                  for (x = Number(new Date(dateStartYear).getFullYear()); x <= Number(new Date(dateEndYear).getFullYear()); x++) {
                    if (timeline[x]) {
                      timeline[x]["countResource"]++
                    } else {
                      timeline[x] = {},
                        timeline[x]["date"] = x,
                        timeline[x]["countPerson"] = 0,
                        timeline[x]["countResource"] = 1,
                        timeline[x]["countEdge"] = 0
                    }
                  }
                }

                ////////////////////////

              }


            }


          });
          (row.graph.relationships.map(function(r) {
            //wenn der Link noch nicht vorkommt, füge ihn hinzu
            if ((links.filter(links => links.id === r.id)).length == 0) {

              links.push({
                id: r.id,
                source: idIndex(nodes, r.startNode),
                target: idIndex(nodes, r.endNode),
                source_copy: idIndex(nodes, r.startNode),
                target_copy: idIndex(nodes, r.endNode),
                _source: nodes[idIndex(nodes, r.startNode)],
                _target: nodes[idIndex(nodes, r.endNode)],
                type: r.type,
                Source: r.properties.Source,
                SourceType: r.properties.SourceType,
                TempValidity: r.properties.TempValidity,
                TypeAddInfo: r.properties.TypeAddInfo,
                value: 1,
                newState: newNode
              })

              nodes.filter(function(q, p) {
                return q.id == r.startNode
              })[0].connectivity++
              nodes.filter(function(q, p) {
                return q.id == r.endNode
              })[0].connectivity++

            }
          }));
        });
      })


      ///connectivity for Person/Corp only
      graph.links.forEach(function(d, i) {
        if (nodes.filter(function(q, p) {
            return p == d.source_copy
          })[0].Label != "GeoName" && nodes.filter(function(q, p) {
            return p == d.target_copy
          })[0].Label != "GeoName" &&
          nodes.filter(function(q, p) {
            return p == d.source_copy
          })[0].Label != "TopicTerm" && nodes.filter(function(q, p) {
            return p == d.target_copy
          })[0].Label != "TopicTerm" &&
          nodes.filter(function(q, p) {
            return p == d.source_copy
          })[0].Label != "IsilTerm" && nodes.filter(function(q, p) {
            return p == d.target_copy
          })[0].Label != "IsilTerm" &&
          nodes.filter(function(q, p) {
            return p == d.source_copy
          })[0].Label != "Resource" && nodes.filter(function(q, p) {
            return p == d.target_copy
          })[0].Label != "Resource" &&
          nodes.filter(function(q, p) {
            return p == d.source_copy
          })[0].Label != "ChronTerm" && nodes.filter(function(q, p) {
            return p == d.target_copy
          })[0].Label != "ChronTerm") {


          ///connectivityclean (rechnet beidseitige Kanten doppelt)
          nodes.filter(function(q, p) {
            return p == d.source_copy
          })[0].connectivityPerCorp++
          nodes.filter(function(q, p) {
            return p == d.target_copy
          })[0].connectivityPerCorp++

        }
      })

      //start linksclean
      ///connectivity for Person/Corp only
      graph.links.forEach(function(d, i) {
        if (nodes.filter(function(q, p) {
            return p == d.source
          })[0].Label != "GeoName" && nodes.filter(function(q, p) {
            return p == d.target
          })[0].Label != "GeoName" &&
          nodes.filter(function(q, p) {
            return p == d.source
          })[0].Label != "TopicTerm" && nodes.filter(function(q, p) {
            return p == d.target
          })[0].Label != "TopicTerm" &&
          nodes.filter(function(q, p) {
            return p == d.source
          })[0].Label != "IsilTerm" && nodes.filter(function(q, p) {
            return p == d.target
          })[0].Label != "IsilTerm" &&
          nodes.filter(function(q, p) {
            return p == d.source
          })[0].Label != "Resource" && nodes.filter(function(q, p) {
            return p == d.target
          })[0].Label != "Resource" &&
          nodes.filter(function(q, p) {
            return p == d.source
          })[0].Label != "Resource" && nodes.filter(function(q, p) {
            return p == d.target
          })[0].Label != "MeetName" &&
          nodes.filter(function(q, p) {
            return p == d.source
          })[0].Label != "Resource" && nodes.filter(function(q, p) {
            return p == d.target
          })[0].Label != "UniTitle" &&
          nodes.filter(function(q, p) {
            return p == d.source
          })[0].Label != "ChronTerm" && nodes.filter(function(q, p) {
            return p == d.target
          })[0].Label != "ChronTerm") {

          nodes.filter(function(q, p) {
            return p == d.source
          })[0].connectivityPerCorp++
          nodes.filter(function(q, p) {
            return p == d.target
          })[0].connectivityPerCorp++

        }
      })

      graph.links.forEach(function(d, i) {
        if (d._source.Label == "PerName" && d._target.Label == "PerName" ||
          d._source.Label == "PerName" && d._target.Label == "CorpName" ||
          d._source.Label == "CoprName" && d._target.Label == "PerName" ||
          d._source.Label == "CoprName" && d._target.Label == "CorpName"
        ) {
          if (linksClean.filter(function(D) {
              return D.source_copy == d.source_copy && D.target_copy == d.target_copy || D.source_copy == d.target_copy && D.target_copy == d.source_copy
            }).length == 0) {

            linksClean.push({
              source: d.source,
              target: d.target,
              _source: d._source,
              _target: d._target,
              source_copy: d.source_copy,
              target_copy: d.target_copy,
              value: 1
            })



            linksClean.filter(function(D) {
              return D.source_copy == d.source_copy && D.target_copy == d.target_copy || D.source_copy == d.target_copy && D.target_copy == d.source_copy
            })[0]["children"] = []

            let originDateApproxBegin = (graph.nodes.filter(function(x) {
              return x.n4jID == d.Source
            })[0] != undefined) ? graph.nodes.filter(function(x) {
              return x.n4jID == d.Source
            })[0].DateApproxBegin2 : undefined
            let originDateApproxEnd = (graph.nodes.filter(function(x) {
              return x.n4jID == d.Source
            })[0] != undefined) ? graph.nodes.filter(function(x) {
              return x.n4jID == d.Source
            })[0].DateApproxEnd2 : undefined
            let TempValidityBegin = undefined
            let TempValidityEnd = undefined

            if (d.TempValidity != undefined && d.TempValidity.length == 4) {
              TempValidityBegin = d.TempValidity
            } else if (d.TempValidity != undefined && d.TempValidity.indexOf("-") != -1 && d.TempValidity.length == 9) {
              TempValidityBegin = d.TempValidity.split("-")[0]
              TempValidityEnd = d.TempValidity.split("-")[1]
            }

            let linkDateDateApproxBegin = (TempValidityBegin != undefined) ? TempValidityBegin : originDateApproxBegin
            let linkDateDateApproxEnd = (TempValidityBegin != undefined) ? TempValidityEnd : originDateApproxEnd


            //timeline stuff start
            if (linkDateDateApproxBegin != undefined && linkDateDateApproxEnd != undefined) {
              for (x = Number(new Date(linkDateDateApproxBegin).getFullYear()); x <= Number(new Date(linkDateDateApproxEnd).getFullYear()); x++) {
                if (timeline[x]) {
                  timeline[x]["countEdge"]++
                } else {
                  timeline[x] = {},
                    timeline[x]["date"] = x,
                    timeline[x]["countPerson"] = 0,
                    timeline[x]["countResource"] = 0,
                    timeline[x]["countEdge"] = 1
                }
              }
            } else if (linkDateDateApproxBegin != undefined) {
              x = Number(new Date(linkDateDateApproxBegin).getFullYear())
              if (timeline[x]) {
                timeline[x]["countEdge"]++
              } else {
                timeline[x] = {},
                  timeline[x]["date"] = x,
                  timeline[x]["countPerson"] = 0,
                  timeline[x]["countResource"] = 0,
                  timeline[x]["countEdge"] = 1
              }
            }
            //timeline stuff ende


            linksClean.filter(function(D) {
              return D.source_copy == d.source_copy && D.target_copy == d.target_copy || D.source_copy == d.target_copy && D.target_copy == d.source_copy
            })[0]["children"].push({
              source: d.source,
              target: d.target,
              _source: d._source,
              _target: d._target,
              source_copy: d.source_copy,
              target_copy: d.target_copy,
              Source: d.Source,
              SourceType: d.SourceType,
              TempValidity: d.TempValidity,
              TypeAddInfo: d.TypeAddInfo,
              origin: (graph.nodes.filter(function(x) {
                return x.n4jID == d.Source
              })[0] != undefined) ? graph.nodes.filter(function(x) {
                return x.n4jID == d.Source
              })[0].Name : undefined,
              originUri: (graph.nodes.filter(function(x) {
                return x.n4jID == d.Source
              })[0] != undefined) ? graph.nodes.filter(function(x) {
                return x.n4jID == d.Source
              })[0].Uri : undefined,
              originId: (graph.nodes.filter(function(x) {
                return x.n4jID == d.Source
              })[0] != undefined) ? graph.nodes.filter(function(x) {
                return x.n4jID == d.Source
              })[0].Id : undefined,
              originType: originType((graph.nodes.filter(function(x) {
                  return x.n4jID == d.Source
                })[0] != undefined) ? graph.nodes.filter(function(x) {
                  return x.n4jID == d.Source
                })[0].Uri : undefined,
                (graph.nodes.filter(function(x) {
                  return x.n4jID == d.Source
                })[0] != undefined) ? graph.nodes.filter(function(x) {
                  return x.n4jID == d.Source
                })[0].Id : undefined),
              linkDateDateApproxBegin: linkDateDateApproxBegin,
              linkDateDateApproxEnd: linkDateDateApproxEnd,
              value: 1
            })




            function originType(uri, id) {
              if (id != undefined) {
                if (id.includes("(DE-101)") || id.includes("DE_101")) {
                  return "DNB"
                } else if (id.includes("DE-599") || id.includes("DE_599")) {
                  return "SBB"
                } else if (id.includes("DE-611") || id.includes("DE_611")) {
                  return "KPE"
                }

              } else if (uri != undefined && uri.includes("kall")) {
                return "KPE"
              } else {
                return "GND"
              }
            }


            nodes.filter(function(q, p) {
              return p == d.source_copy
            })[0].connectivityClean++
            nodes.filter(function(q, p) {
              return p == d.target_copy
            })[0].connectivityClean++


          } else {
            if (linksClean.filter(function(D) {
                return D.source_copy == d.source_copy && D.target_copy == d.target_copy || D.source_copy == d.target_copy && D.target_copy == d.source_copy
              })[0]["children"]
              .filter(function(x, y) {
                return x.Source == d.Source && x.SourceType == d.SourceType && x.TypeAddInfo == d.TypeAddInfo && x.TempValidity == d.TempValidity
              }).length == 0) {

              linksClean.filter(function(D) {
                return D.source_copy == d.source_copy && D.target_copy == d.target_copy || D.source_copy == d.target_copy && D.target_copy == d.source_copy
              })[0].value++


              let originDateApproxBegin = (graph.nodes.filter(function(x) {
                return x.n4jID == d.Source
              })[0] != undefined) ? graph.nodes.filter(function(x) {
                return x.n4jID == d.Source
              })[0].DateApproxBegin2 : undefined
              let originDateApproxEnd = (graph.nodes.filter(function(x) {
                return x.n4jID == d.Source
              })[0] != undefined) ? graph.nodes.filter(function(x) {
                return x.n4jID == d.Source
              })[0].DateApproxEnd2 : undefined
              let TempValidityBegin = undefined
              let TempValidityEnd = undefined

              if (d.TempValidity != undefined && d.TempValidity.length == 4) {
                TempValidityBegin = d.TempValidity
              } else if (d.TempValidity != undefined && d.TempValidity.indexOf("-") != -1 && d.TempValidity.length == 9) {
                TempValidityBegin = d.TempValidity.split("-")[0]
                TempValidityEnd = d.TempValidity.split("-")[1]
              }

              let linkDateDateApproxBegin = (TempValidityBegin != undefined) ? TempValidityBegin : originDateApproxBegin
              let linkDateDateApproxEnd = (TempValidityBegin != undefined) ? TempValidityEnd : originDateApproxEnd

              //timeline stuff start
              if (linkDateDateApproxBegin != undefined && linkDateDateApproxEnd != undefined) {
                for (x = Number(new Date(linkDateDateApproxBegin).getFullYear()); x <= Number(new Date(linkDateDateApproxEnd).getFullYear()); x++) {
                  if (timeline[x]) {
                    timeline[x]["countEdge"]++
                  } else {
                    timeline[x] = {},
                      timeline[x]["date"] = x,
                      timeline[x]["countPerson"] = 0,
                      timeline[x]["countResource"] = 0,
                      timeline[x]["countEdge"] = 1
                  }
                }
              } else if (linkDateDateApproxBegin != undefined) {
                x = Number(new Date(linkDateDateApproxBegin).getFullYear())
                if (timeline[x]) {
                  timeline[x]["countEdge"]++
                } else {
                  timeline[x] = {},
                    timeline[x]["date"] = x,
                    timeline[x]["countPerson"] = 0,
                    timeline[x]["countResource"] = 0,
                    timeline[x]["countEdge"] = 1
                }
              }
              //timeline stuff ende

              linksClean.filter(function(D) {
                return D.source_copy == d.source_copy && D.target_copy == d.target_copy || D.source_copy == d.target_copy && D.target_copy == d.source_copy
              })[0]["children"].push({
                source: d.source,
                target: d.target,
                _source: d._source,
                _target: d._target,
                source_copy: d.source_copy,
                target_copy: d.target_copy,
                Source: d.Source,
                SourceType: d.SourceType,
                TempValidity: d.TempValidity,
                TypeAddInfo: d.TypeAddInfo,
                origin: (graph.nodes.filter(function(x) {
                  return x.n4jID == d.Source
                })[0] != undefined) ? graph.nodes.filter(function(x) {
                  return x.n4jID == d.Source
                })[0].Name : undefined,
                originUri: (graph.nodes.filter(function(x) {
                  return x.n4jID == d.Source
                })[0] != undefined) ? graph.nodes.filter(function(x) {
                  return x.n4jID == d.Source
                })[0].Uri : undefined,
                originId: (graph.nodes.filter(function(x) {
                  return x.n4jID == d.Source
                })[0] != undefined) ? graph.nodes.filter(function(x) {
                  return x.n4jID == d.Source
                })[0].Id : undefined,
                originType: originType((graph.nodes.filter(function(x) {
                    return x.n4jID == d.Source
                  })[0] != undefined) ? graph.nodes.filter(function(x) {
                    return x.n4jID == d.Source
                  })[0].Uri : undefined,
                  (graph.nodes.filter(function(x) {
                    return x.n4jID == d.Source
                  })[0] != undefined) ? graph.nodes.filter(function(x) {
                    return x.n4jID == d.Source
                  })[0].Id : undefined),
                linkDateDateApproxBegin: linkDateDateApproxBegin,
                linkDateDateApproxEnd: linkDateDateApproxEnd,
                value: 1
              })
            }




            function originType(uri, id) {
              if (id != undefined) {
                if (id.includes("(DE-101)") || id.includes("DE_101")) {
                  return "DNB"
                } else if (id.includes("DE-599") || id.includes("DE_599")) {
                  return "SBB"
                } else if (id.includes("DE-611") || id.includes("DE_611")) {
                  return "KPE"
                }

              } else if (uri != undefined && uri.includes("kall")) {
                return "KPE"
              } else {
                return "GND"
              }
            }

          }


        }

      })

      //ende linksclean

      console.log(linksClean)

      console.log(graph.nodes)

      console.log(graph.links)
      if (type == "execute") {
        renderNetwork()
      } else {
        renderNetwork()
      }

    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      $('#messageArea').html('<h3>' + textStatus + ' : ' + errorThrown + '</h3>')
    });
};


maxValueinNodes = Math.max(...graph.nodes.filter(function(d) {
  return d.Label == "PerName" || d.Label == "CorpName"
}).map(o => o.connectivityClean), 0) //Math.max


let nodeSize = d3.scaleLinear()
  .domain([0, maxValueinNodes])
  .range([6, 30]);

const edgeColors = d3.scaleOrdinal()
  .domain(["KPE", "GND", "SBB", "DNB", "ZDB", "computed"])
  .range(["var(--KPE)", "var(--GND)", "var(--SBB)", "var(--DNB)", "var(--ZDB)", "grey"])




let edgeNoScale = d3.scaleLinear()
  .domain([1, maxValueinLinks])
  .range(["rgb(199, 197, 197)", "rgb(199, 197, 197)"])


let edgeNoScaleWidth = d3.scaleLinear()
  .domain([1, maxValueinLinks])
  .range([1, 6])


let detailview = false;




const color = d3.scaleOrdinal()
  .domain(["Selection", "PerName", "CorpName", "MeetName", "UniTitle", "TopicTerm", "GeoName", "Resource", "ChronTerm"])
  .range(["black", "rgb(78, 78, 78)", "rgb(152, 152, 152)", "rgb(78, 78, 78)", "rgb(78, 78, 78)", "rgb(78, 78, 78)", "rgb(78, 78, 78)", "rgb(78, 78, 78)"]);



let zoom = d3.zoom()
  .scaleExtent([1 / 3, 8])
  .on("zoom", zoomed)

const svg = d3.select("#graph")
  .attr("preserveAspectRatio", "xMidYMid")
  .attr("viewBox", "0 0 " + windowWidth + " " + windowHeight)
  .call(zoom)
  .on("dblclick.zoom", null);

let svgG = svg.append("g").attr("class", "svgG")



let zoomlevel = 1

function zoomed() {
  zoomlevel = d3.event.transform.k

  svgG.attr("transform", d3.event.transform);

  // only apply transform for zoom in, not zoom out
  if (mode == "graph") {

    node.selectAll("rect")
      .filter(function(d, i) {
        return d3.select(this).attr("class") != "notedgerelevant"
      })
      .attr("width", function(d, i) {
        return (zoomlevel > 1) ? (nodeSize(d.connectivityClean) / zoomlevel) : nodeSize(d.connectivityClean)
      })
      .attr("height", function(d, i) {
        return (d3.event.transform.k > 1) ? (nodeSize(d.connectivityClean) / zoomlevel) : nodeSize(d.connectivityClean)
      })
      .attr("x", function(d, i) {
        return d.x - ((zoomlevel >= 1) ? (nodeSize(d.connectivityClean) / zoomlevel) : nodeSize(d.connectivityClean)) / 2;
      })
      .attr("y", function(d, i) {
        return d.y - ((zoomlevel >= 1) ? (nodeSize(d.connectivityClean) / zoomlevel) : nodeSize(d.connectivityClean)) / 2;
      })
      .style("stroke-width", function(d, i) {
        return (zoomlevel > 1) ? 0.5 / zoomlevel : 0.5
      })

    node.selectAll("rect")
      .filter(".notedgerelevant")
      .attr("width", function(d, i) {
        return 3 / zoomlevel
      })
      .attr("height", function(d, i) {
        return 3 / zoomlevel
      })
      .attr("x", function(d, i) {
        return d.x - (3 / zoomlevel) / 2
      })
      .attr("y", function(d, i) {
        return d.y - (3 / zoomlevel) / 2
      })
      .style("stroke-width", function(d, i) {
        return (zoomlevel > 1) ? 0.5 / zoomlevel : 0.5
      })

    d3.selectAll(".nodesOnTop")
      .attr("width", function(d, i) {
        return (d3.event.transform.k > 1) ? (nodeSize(d3.select(this).attr("connectivityClean")) / d3.event.transform.k) : nodeSize(d3.select(this).attr("connectivityClean"))
      })
      .attr("height", function(d, i) {
        return (d3.event.transform.k > 1) ? (nodeSize(d3.select(this).attr("connectivityClean")) / d3.event.transform.k) : nodeSize(d3.select(this).attr("connectivityClean"))
      })
      .style("stroke-width", function(d, i) {
        return (d3.event.transform.k > 1) ? 0.5 / d3.event.transform.k : 0.5
      })

    link.selectAll(".link")
      .style("stroke-width", function(d, i) {
        edgeNoScaleWidth = d3.scaleLinear()
          .domain([1, maxValueinLinks])
          .range([0.75, 7])
        return (d3.event.transform.k > 1) ? (edgeNoScaleWidth(d.value) / d3.event.transform.k) : edgeNoScaleWidth(d.value)
      })

    linkChildren.selectAll(".linkChild")
      .style("stroke-width", function(d, i) {
        return (d3.event.transform.k > 1) ? 1.5 / d3.event.transform.k : 1.5
      })

  }
}


function listDropdownChange() {
  let type = $('#filter-select-dropdown').val()

  d3.select(".filterlistsearch").on("input", function() {
    let filterListinput = this.value.toLowerCase()

    d3.selectAll(".filterlisttr").style("display", function(d) {
      if (d.Name.toLowerCase().includes(filterListinput)) {
        return "table-row"
      } else {
        return "none"
      }
    })

  })

  if (type != "SourceType" && type != "TypeAddInfo" && type != "TempValidity") {

    let filtertablerow = d3.select("#filterlisttable")
      .selectAll("tr")
      .data(graph.nodes.filter(function(d, i) {
        return d.Label == type
      }).sort(function(a, b) {
        return d3.descending(a.connectivityClean ? a.connectivityClean : a.connectivity, b.connectivityClean ? b.connectivityClean : b.connectivity)
      }))
      .join("tr")
      .attr("class", "filterlisttr")
      .on("click", function(d, i) {
        d3.event.stopPropagation()
        d3.select("#details").style("display", "none").selectAll("p").remove()
        d3.selectAll(".filterCross").remove()

        if(d3.select(this).classed("filteractive") == false){

          d3.event.stopPropagation()
          detailview = true;
          d3.selectAll(".filtertableicon").text("+")
          d3.selectAll(".filterlisttr").classed("filteractive", false)
          d3.select(this).selectAll(".filtertableicon").text("✕")
          d3.select(this).classed("filteractive", true)

          mouseClick(d, i)
        }else{
            d3.event.stopPropagation()
            d3.selectAll(".filtertableicon").text("+")
            d3.selectAll(".filterlisttr").classed("filteractive", false)
            d3.select("#details").style("display", "none").selectAll("p").remove()
            detailview = false;
            mouseOut(d, i)
        }
      })

    filtertablerow.selectAll("td").remove()
    let filtertableicons = filtertablerow.append("td").classed("filtertableicon", true).text("+")

    let filtertablename = filtertablerow.append("td").classed("filtertablename", true).text(function(d, i) {
      return d.Name
    })


    let filtertableCount = filtertablerow.append("td").classed("filtertableCount", true).text("10").text(function(d, i) {
      if (d.Label == "PerName" || d.Label == "CorpName") {
        return d.connectivityClean
      } else {
        return d.connectivity
      }
    })

  } else if (type == "SourceType") {

    let linkSourceTypeCount = d3.nest()
      .key(function(d) {
        return d.SourceType;
      })
      .rollup(function(v) {
        return v.length;
      })
      .entries(links.filter(function(d) {
        return d._source.Label == "PerName" && d._target.Label == "PerName" || d.type == "SocialRelation" ||
          d._source.Label == "PerName" && d._target.Label == "CorpName" ||
          d._source.Label == "CorpName" && d._target.Label == "PerName" ||
          d._source.Label == "CorpName" && d._target.Label == "CorpName"
      }));


      let filtertablerow = d3.select("#filterlisttable")
        .selectAll("tr")
        .data(linkSourceTypeCount.sort((a, b) => d3.descending(a.value, b.value)).filter(function(d) {
          return d.key != "undefined"
        }))
        .join("tr")
        .attr("class", "filterlisttr")
        .on("click", function(d, i) {
          d3.event.stopPropagation()
          d3.select("#details").style("display", "none").selectAll("p").remove()
          d3.selectAll(".filterCross").remove()


          if(d3.select(this).classed("filteractive") == false){

            d3.event.stopPropagation()
            d3.selectAll(".filtertableicon").text("+")
            d3.selectAll(".filterlisttr").classed("filteractive", false)
            d3.select(this).selectAll(".filtertableicon").text("✕")
            d3.select(this).classed("filteractive", true)

            detailview = false;

            mouseOut()

            d3.selectAll(".link").filter(function(D, I) {
                return D.children.filter(function(x) {
                  return x.SourceType === d.key
                }).length < 1
              })
              .style("opacity", 0)


            let connectedNodes = []

            d3.selectAll(".link").filter(function(D, I) {
                return D.children.filter(function(x) {
                  return x.SourceType === d.key
                }).length > 0
              })
              .style("opacity", 1)
              .each(function(D, I) {
                if (connectedNodes.filter(function(x) {
                    return x == D._source.id
                  }).length == 0) {
                  connectedNodes.push(
                    D._source.id
                  )
                }
                if (connectedNodes.filter(function(x) {
                    return x == D._target.id
                  }).length == 0) {
                  connectedNodes.push(
                    D._target.id
                  )
                }
              })

            d3.selectAll(".nodes").classed("filteredIn", false).classed("filteredOut", true)

            d3.selectAll(".nodes")
              .filter(function(E, G) {
                return connectedNodes.filter(function(d) {
                  return d == E.id
                }).length > 0
              }).classed("filteredIn", true).classed("filteredOut", false)
          }else{
              d3.event.stopPropagation()
              d3.selectAll(".filtertableicon").text("+")
              d3.selectAll(".filterlisttr").classed("filteractive", false)
              d3.select("#details").style("display", "none").selectAll("p").remove()
              detailview = false;
              mouseOut(d, i)
          }
        })


        filtertablerow.selectAll("td").remove()
        let filtertableicons = filtertablerow.append("td").classed("filtertableicon", true).text("+")

        let filtertablename = filtertablerow.append("td").classed("filtertablename", true).text(function(d, i) {
          return d.key
        })


        let filtertableCount = filtertablerow.append("td").classed("filtertableCount", true).text("10").text(function(d, i) {return d.value})




  } else if (type == "TypeAddInfo") {
    let linkTypeAddInfoCount = d3.nest()
      .key(function(d) {
        return d.TypeAddInfo;
      })
      .rollup(function(v) {
        return v.length;
      })
      .entries(links.filter(function(d) {
        return d._source.Label == "PerName" && d._target.Label == "PerName" || d.type == "SocialRelation" ||
          d._source.Label == "PerName" && d._target.Label == "CorpName" ||
          d._source.Label == "CorpName" && d._target.Label == "PerName" ||
          d._source.Label == "CorpName" && d._target.Label == "CorpName"
      }));


      let filtertablerow = d3.select("#filterlisttable")
        .selectAll("tr")
      .data(linkTypeAddInfoCount.sort((a, b) => d3.descending(a.value, b.value)).filter(function(d) {
        return d.key != "undefined"
      }))
      .join("tr")
      .attr("class", "filterlisttr")
      .on("click", function(d, i) {

        if(d3.select(this).classed("filteractive") == false){

          d3.event.stopPropagation()
          d3.selectAll(".filtertableicon").text("+")
          d3.selectAll(".filterlisttr").classed("filteractive", false)
          d3.select(this).selectAll(".filtertableicon").text("✕")
          d3.select(this).classed("filteractive", true)

          detailview = false;

          mouseOut()


        d3.selectAll(".link").filter(function(D, I) {
            return D.children.filter(function(x) {
              return x.TypeAddInfo === d.key
            }).length < 1
          })
          .style("opacity", 0)


        let connectedNodes = []

        d3.selectAll(".link").filter(function(D, I) {
            return D.children.filter(function(x) {
              return x.TypeAddInfo === d.key
            }).length > 0
          })
          .style("opacity", 1)
          .each(function(D, I) {
            if (connectedNodes.filter(function(x) {
                return x == D._source.id
              }).length == 0) {
              connectedNodes.push(
                D._source.id
              )
            }
            if (connectedNodes.filter(function(x) {
                return x == D._target.id
              }).length == 0) {
              connectedNodes.push(
                D._target.id
              )
            }
          })

        d3.selectAll(".nodes").classed("filteredIn", false).classed("filteredOut", true)

        d3.selectAll(".nodes")
          .filter(function(E, G) {
            return connectedNodes.filter(function(d) {
              return d == E.id
            }).length > 0
          }).classed("filteredIn", true).classed("filteredOut", false)
}else{
d3.event.stopPropagation()
d3.selectAll(".filtertableicon").text("+")
d3.selectAll(".filterlisttr").classed("filteractive", false)
d3.select("#details").style("display", "none").selectAll("p").remove()
detailview = false;
mouseOut(d, i)
}
      })

      filtertablerow.selectAll("td").remove()
      let filtertableicons = filtertablerow.append("td").classed("filtertableicon", true).text("+")

      let filtertablename = filtertablerow.append("td").classed("filtertablename", true).text(function(d, i) {
        return d.key
      })


      let filtertableCount = filtertablerow.append("td").classed("filtertableCount", true).text("10").text(function(d, i) {return d.value})



  }
}

////statistic update function (left side) start
////////////////////////////////////////////////
function statsUpdate() {
  ///statistics start

  d3.select("#metrics-table").selectAll("tr").remove()

  let metricsPerName = d3.select("#metrics-table").append("tr")

  metricsPerName.append("td").text("Personen:")
  metricsPerName.append("td").text(graph.nodes.filter(function(d, i) {
      return d.Label == "PerName"
    }).length + " (♂" + graph.nodes.filter(function(d, i) {
      return d.Label == "PerName" && d.Gender == "1"
    }).length +
    "/♀" + graph.nodes.filter(function(d, i) {
      return d.Label == "PerName" && d.Gender == "2"
    }).length + ")")

  let metricsCorpName = d3.select("#metrics-table").append("tr")

  metricsCorpName.append("td").text("Körperschaften:")
  metricsCorpName.append("td").text(graph.nodes.filter(function(d, i) {
    return d.Label == "CorpName"
  }).length)

  let metricsGeoName = d3.select("#metrics-table").append("tr")

  metricsGeoName.append("td").text("Geographika:")
  metricsGeoName.append("td").text(graph.nodes.filter(function(d, i) {
    return d.Label == "GeoName"
  }).length)

  let metricsTopicTerm = d3.select("#metrics-table").append("tr")

  metricsTopicTerm.append("td").text("Schlagworte:")
  metricsTopicTerm.append("td").text(graph.nodes.filter(function(d, i) {
    return d.Label == "TopicTerm"
  }).length)

  let metricsMeetName = d3.select("#metrics-table").append("tr")

  metricsMeetName.append("td").text("Veranstaltungen:")
  metricsMeetName.append("td").text(graph.nodes.filter(function(d, i) {
    return d.Label == "MeetName"
  }).length)

  let metricsUniTitle = d3.select("#metrics-table").append("tr")

  metricsUniTitle.append("td").text("Werke:")
  metricsUniTitle.append("td").text(graph.nodes.filter(function(d, i) {
    return d.Label == "UniTitle"
  }).length)

  let metricsResource = d3.select("#metrics-table").append("tr")

  metricsResource.append("td").text("Ressourcen:")
  metricsResource.append("td").text(graph.nodes.filter(function(d, i) {
    return d.Label == "Resource"
  }).length)


  let metricsRelationsGND = d3.select("#metrics-table").append("tr")

  metricsRelationsGND.append("td").text("GND Relationen:").style("color", edgeColors("GND"))
  metricsRelationsGND.append("td")
    .text(graph.links.filter(function(d, i) {
      return d.Source == "GND"
    }).length)
    .style("color", edgeColors("GND"))


  let metricsRelationsKPE = d3.select("#metrics-table").append("tr")

  metricsRelationsKPE.append("td").text("KPE Relationen:").style("color", edgeColors("KPE"))
  metricsRelationsKPE.append("td")
    .text(graph.links.filter(function(d, i) {
      return d.Source == "KPE"
    }).length)
    .style("color", edgeColors("KPE"))

  let metricsRelationsDNB = d3.select("#metrics-table").append("tr")

  metricsRelationsDNB.append("td").text("DNB Relationen:").style("color", edgeColors("DNB"))
  metricsRelationsDNB.append("td")
    .text(graph.links.filter(function(d, i) {
      return d.Source == "DNB"
    }).length)
    .style("color", edgeColors("DNB"))

  let metricsRelationsSBB = d3.select("#metrics-table").append("tr")

  metricsRelationsSBB.append("td").text("SBB Relationen:").style("color", edgeColors("SBB"))
  metricsRelationsSBB.append("td")
    .text(graph.links.filter(function(d, i) {
      return d.Source == "SBB"
    }).length)
    .style("color", edgeColors("SBB"))

  let metricsRelationsZDB = d3.select("#metrics-table").append("tr")

  metricsRelationsZDB.append("td").text("ZDB Relationen:").style("color", edgeColors("ZDB"))
  metricsRelationsZDB.append("td")
    .text(graph.links.filter(function(d, i) {
      return d.Source == "ZDB"
    }).length)
    .style("color", edgeColors("ZDB"))
}

////statistic update function (left side) end
////////////////////////////////////////////////

///////force simulation

let simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id(function(d, i) {
      return i;
    })
  )
  .force("charge", d3.forceManyBody().strength(function(d, i) {
    if (d.Label == "GeoName" || d.Label == "TopicTerm" || d.Label == "IsilTerm" || d.Label == "Resource") {
      return 0
    } else {
      return -30
    }
  }))
  .force('collision', d3.forceCollide().radius(function(d, i) {
    if (d.Label == "GeoName" || d.Label == "TopicTerm" || d.Label == "IsilTerm" || d.Label == "Resource") {
      return 0
    } else {
      return nodeSize(d.connectivityClean) + 2
    }
  }))
  .force("center", d3.forceCenter(windowWidth / 2, -100 + windowHeight / 2));


let link = svgG.append("g").attr("class", "linkG")
let node = svgG.append("g").attr("class", "nodeG")
let linkChildren = svgG.append("g").attr("class", "linkChildrenG")
let nodesOnTop = svgG.append("g").attr("class", "nodesOnTopG")



function renderNetwork() {

  let nodeLabelCount = d3.nest()
    .key(function(d) {
      return d.Label;
    })
    .rollup(function(v) {
      return v.length;
    })
    .entries(nodes);

  let linkSourceCount = d3.nest()
    .key(function(d) {
      return d.Source;
    })
    .rollup(function(v) {
      return v.length;
    })
    .entries(links);


  let linkTypeAddInfoCount = d3.nest()
    .key(function(d) {
      return d.TypeAddInfo;
    })
    .rollup(function(v) {
      return v.length;
    })
    .entries(links);


  detailview = false;


  maxValueinNodes = Math.max(...graph.nodes.filter(function(d) {
    return d.Label == "PerName" || d.Label == "CorpName"
  }).map(o => o.connectivityClean), 0)


  nodeSize = d3.scaleLinear()
    .domain([0, maxValueinNodes])
    .range([6, 30]);



  listDropdownChange()
  statsUpdate()

  simulation.alpha(1).restart();



  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation
    .force("link")
    .links(linksClean);






  maxValueinLinks = Math.max(...linksClean.map(o => o.value), 0)


  let edgeNoScale = d3.scaleLinear()
    .domain([1, maxValueinLinks])
    .range(["rgb(199, 197, 197)", "rgb(199, 197, 197)"])



  let edgeNoScaleWidth = d3.scaleLinear()
    .domain([1, maxValueinLinks])
    .range([1, 6])



  link.selectAll(".link")
    .data(linksClean)
    .join("path")
    .style("fill", "none")
    .attr("class", "link")
    .style("display", null)
    .style("stroke", function(d, i) {
      return edgeNoScale(d.value)
    })
    .style("stroke-width", function(d, i) {
      return edgeNoScaleWidth(d.value)
    })
    .style("opacity", 1)
    .style("cursor", "pointer")
    .on("mousemove", function(d, i) {
      d3.select(this).style("stroke", "black")
      d3.select(".tooltip").select("p")
        .text(function() {
          return d._source.Name + " – " + d._target.Name + " (" + d.value + ")"
        })
        .style("font-weight", "bold")

      d3.select(".tooltip")
        .style("opacity", .9)
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 5) + "px");
    })
    .on("mouseout", function(d, i) {
      d3.select(this)
        .style("stroke", function(d, i) {
          return edgeNoScale(d.value)
        })

      d3.select(".tooltip").select("p")
        .text(null)

      d3.select(".tooltip")
        .style("opacity", 0)
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 5) + "px");
    })
    .on("click", function(d, i) {
      edgeClick(d, i)
      if (mode == "graph") {
        ///////edge unfolding start
        ////////////////////////////////////////////////

        d3.selectAll(".link").transition().style("stroke", "#E3E3E2").style("opacity", 1)
        d3.select(this).transition().style("opacity", 0)


        let x1 = d.source.x //x Punkt A
        let y1 = d.source.y //y Punkt A
        let x2 = d.target.x //x Punkt B
        let y2 = d.target.y //y Punkt B
        let mx = (x1 + x2) / 2 // Mittelpunkt x zwischen x1 und x2
        let my = (y1 + y2) / 2 // Mittelpunkt y zwischen y1 und y2

        //zoom.scaleBy(svg, 20)
        zoom.translateTo(svg.transition().duration(500), mx, my)
        setTimeout(function() {
          zoom.scaleTo(svg.transition().duration(500), 3)
        }, 750);



        d3.selectAll(".nodes")
          .classed("notedgerelevant", false)
          .filter(function(D) {
            return D.id != d._source.id || D.id != d._target.id
          })
          .classed("notedgerelevant", true)
          .transition().style("fill", "#D3D3D3")
          .attr("width", function(d, i) {
            return 3 / zoomlevel
          })
          .attr("height", function(d, i) {
            return 3 / zoomlevel
          })


        d3.selectAll(".nodesOnTop").remove()

        d3.selectAll(".nodes").filter(function(D) {
            return D.id == d._source.id || D.id == d._target.id
          }).classed("notedgerelevant", false)
          .each(function(T) {

              nodesOnTop.append("rect")
                .classed("nodesOnTop", true)
                .style("fill", function() {
                  return color("Selection")
                })
                .attr("width", function() {
                  return (zoomlevel >= 1) ? (nodeSize(T.connectivityClean) / zoomlevel) : nodeSize(T.connectivityClean)
                })
                .attr("height", function() {
                  return (zoomlevel >= 1) ? (nodeSize(T.connectivityClean) / zoomlevel) : nodeSize(T.connectivityClean)
                })
                .attr("x", function() {
                  return T.x - (zoomlevel >= 1) ? (nodeSize(T.connectivityClean) / zoomlevel) : nodeSize(T.connectivityClean) / 2;
                })
                .attr("y", function() {
                  return T.y - (zoomlevel >= 1) ? (nodeSize(T.connectivityClean) / zoomlevel) : nodeSize(T.connectivityClean) / 2;
                })
                .attr("rx", function() {
                  if (T.Label == "PerName") {
                    return 1000 //height number because"If rx is greater than half of the width of the rectangle, then the browser will consider the value for rx as half of the width of the rectangle."
                  } else {
                    return 2
                  }
                })
                .attr("connectivity", T.connectivityClean)
            }
          )

        d3.selectAll(".nodes").filter(function(D) {
          return D.id == d._source.id || D.id == d._target.id
        }).transition().style("fill", "black").style("opacity", 1)

        d3.select(".linkChildrenG").selectAll(".linkChild")
          .data(d.children)
          .join("path")
          .style("fill", "none")
          .attr("stroke-width", function() {
            return (zoomlevel > 1) ? 1.5 / zoomlevel : 1.5
          })
          .attr("class", "linkChild")
          .style("stroke-dasharray", function(D, I) {
            if (D.originType == "GND") {
              return null
            } else {
              return null
            }
          })
          .style("stroke", function(D, I) {
            return edgeColors(D.originType)

          })
          .attr("d", function(D, I) {
            let x1 = d.source.x //x Punkt A
            let y1 = d.source.y //y Punkt A
            let A = [x1, y1]
            let x2 = d.target.x //x Punkt B
            let y2 = d.target.y //y Punkt B
            let B = [x2, y2]
            let mx = (x1 + x2) / 2 // Mittelpunkt x zwischen x1 und x2
            let my = (y1 + y2) / 2 // Mittelpunkt y zwischen y1 und y2
            let M = [mx, my] // Mittelpunkt zwischen A und B (hier verläuft das Lot hoehe)

            return "M" + d.source.x + " " + d.source.y +
              " C " + mx + " " + my + " " +
              mx + " " + my + " " +
              d.target.x + " " + d.target.y
          })
          .transition()
          .duration(800)
          .attr("d", function(D, I) {

            let x1 = d.source.x //x Punkt A
            let y1 = d.source.y //y Punkt A
            let A = [x1, y1]
            let x2 = d.target.x //x Punkt B
            let y2 = d.target.y //y Punkt B
            let B = [x2, y2]
            let mx = (x1 + x2) / 2 // Mittelpunkt x zwischen x1 und x2
            let my = (y1 + y2) / 2 // Mittelpunkt y zwischen y1 und y2
            let M = [mx, my] // Mittelpunkt zwischen A und B (hier verläuft das Lot hoehe)

            let hoehe // höhe des Ausschlags basierend auf I
            if (I % 2) { //gerade Zahl oder ungerade Zahl damit abwechselnd oben und unten die Kante ausschlägt
              hoehe = (I) * 3
            } else {
              hoehe = 3 + (I * 3)
            }



            let AM = Math.hypot(mx - x1, my -
              y1) //Funktion gibt die Quadratwurzel von der Summe der quadrierten Argumente zurück. Hier Berechnung der Kante von PunktA(x1y1) zu Mittelpunkt zwischen A und B (x2y2), weil dort die Höhe rechtwinklig zur Kante läuft
            let AP = Math.hypot(AM, hoehe) //Funktion gibt die Quadratwurzel von der Summe der quadrierten Argumente zurück: Kante A zu gesuchten Punkt
            let P = Intersect2Circles(A, AP, M, hoehe) //gesuchter Punkt

            let x3 //P[1][0] //x von P
            let y3 //= P[1][1] //y von OP

            if (I % 2) {
              x3 = P[0][0]
              y3 = P[0][1]
            } else {
              x3 = P[1][0]
              y3 = P[1][1]
            }

            //Pfad unter Nutzung von allen drei Punkten
            return "M" + d.source.x + " " + d.source.y +
              " C " + x3 + " " + y3 + " " +
              x3 + " " + y3 + " " +
              d.target.x + " " + d.target.y
          })



      }
      ///////edge unfolding end
      ////////////////////////////////////////////////
    })

  //http://walter.bislins.ch/blog/index.asp?page=Schnittpunkte+zweier+Kreise+berechnen+%28JavaScript%29
  //Intersect2Circles function start: find point using 2 points and 2 edge lengths
  function Intersect2Circles(A, a, B, b) {
    // A, B = [ x, y ]
    // return = [ Q1, Q2 ] or [ Q ] or [] where Q = [ x, y ]
    var AB0 = B[0] - A[0];
    var AB1 = B[1] - A[1];
    var c = Math.sqrt(AB0 * AB0 + AB1 * AB1);
    if (c == 0) {
      // no distance between centers
      return [];
    }
    var x = (a * a + c * c - b * b) / (2 * c);
    var y = a * a - x * x;
    if (y < 0) {
      // no intersection
      return [];
    }
    if (y > 0) y = Math.sqrt(y);
    // compute unit vectors ex and ey
    var ex0 = AB0 / c;
    var ex1 = AB1 / c;
    var ey0 = -ex1;
    var ey1 = ex0;
    var Q1x = A[0] + x * ex0;
    var Q1y = A[1] + x * ex1;
    if (y == 0) {
      // one touch point
      return [
        [Q1x, Q1y]
      ];
    }
    // two intersections
    var Q2x = Q1x - y * ey0;
    var Q2y = Q1y - y * ey1;
    Q1x += y * ey0;
    Q1y += y * ey1;
    return [
      [Q1x, Q1y],
      [Q2x, Q2y]
    ];
  }
  //Intersect2Circles function end
  ////////////////////////////////

  node.selectAll("rect")
    .data(graph.nodes.filter(function(d) {
      return d.Label != "GeoName" && d.Label != "TopicTerm" &&
        d.Label != "IsilTerm" && d.Label != "Resource" && d.Label != "ChronTerm" &&
        d.Label != "UniTitle" && d.Label != "MeetName"
    }))
    .join("rect")
    .attr("class", "nodes")
    .attr("width", function(d, i) {
      return nodeSize(d.connectivityClean)
    })
    .attr("height", function(d, i) {
      return nodeSize(d.connectivityClean)
    })
    .attr("rx", function(d, i) {
      if (d.Label == "PerName") {
        return 1000 //height number because"If rx is greater than half of the width of the rectangle, then the browser will consider the value for rx as half of the width of the rectangle."
      } else {
        return 0
      }
    })
    .style("fill", function(d, i) {
      if (($('#search_category_select').val() == "GND-ID") && d.Id == $('#suche').val()) {
        return color("Selection")
      } else if (d.Label == "PerName") {
        return color(d.Label)
      } else {
        return color(d.Label)
      }
    })
    .style("stroke", function(d, i) {
      if (d.newState == true) {
        return "var(--main-bg-color)"
      } else {
        return "var(--main-bg-color)"
      }
    })
    .style("stroke-width", function(d, i) {
      if (d.newState == true) {
        return 0.5
      } else {
        return 0.5
      }
    })
    .style("display", null)
    .on("click", function(d, i) {

      detailview = true;
      mouseClick(d, i)
    })
    .on("mousemove", function(d, i) {
      d3.select(".tooltip").select("p")
        .text(function() {
          return d.Name + " (" + d.DateApproxBegin + "–" + d.DateApproxEnd + ")"
        })
        .style("font-weight", "bold")

      d3.select(".tooltip")
        .style("opacity", .9)
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 5) + "px");
    })
    .on("mouseout", function(d, i) {
      d3.select(".tooltip").select("p")
        .text(null)

      d3.select(".tooltip")
        .style("opacity", 0)
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 5) + "px");
    })
    .filter(function(d, i) {
      return d.Label == "PerName"
    })
    .on("dblclick", function(d, i) {
      if(mode == "graph"){
      d3.select("#load").style("display", "block");
      d3.select("#loadbg").style("display", "block");
      d3.select("#details").style("display", "none").selectAll("p").remove()
      detailview = false;
      mouseOut(d, i)

      post_cypherquery("addByNode", d.Id)
    }
    })





  d3.selectAll("#closedetails")
    .on("click", function(d, i) {
      d3.select("#details").style("display", "none").selectAll("p").remove()
      detailview = false;
      mouseOut(d, i)
    })




  ////////////timeline start

  //get all keys (years) of timeline array and transform the strings to numbers. use that for a flexible scale
  let timelinelengthHelper = timeline.filter(function(d) {
    return d.countPerson != 0 || d.countEdge != 0
  }).length
  let timelineStartEndWithoutRessources = [timeline.filter(function(d) {
    return d.countPerson != 0 || d.countEdge != 0
  })[0].date, timeline.filter(function(d) {
    return d.countPerson != 0 || d.countEdge != 0
  })[timelinelengthHelper - 1].date]


  let timelineYears = Object.keys(timeline).map(Number)
  let timelineCountArray = []
  let timelineCountResourceArray = []
  let timelineCountEdgeseArray = []
  timelineInterval = d3.extent(timelineStartEndWithoutRessources)




  //create array of all count-numbers of the years to use that for the max year count for a flexible scale
  timeline.forEach(function(d, i) {
    timelineCountArray.push(d.countPerson)
    timelineCountResourceArray.push(d.countResource)
    timelineCountEdgeseArray.push(d.countEdge)
  })

  timelineMaxCount = d3.max(timelineCountArray)
  timelineMaxResourceCount = d3.max(timelineCountResourceArray)
  timelineMaxEdgesCount = d3.max(timelineCountEdgeseArray)




  let timelineMarginTop = 145

  // let timelineScale = d3.scaleLinear()
  //   .domain(d3.extent(timelineStartEndWithoutRessources))
  //   .range([0, windowHeight - timelineMarginTop]);
  timelineScale = d3.scaleLinear()
    .domain(timelineInterval)
    .range([0, windowWidth]);



  let timelineXScale = d3.scaleLinear()
    .domain([0, timelineMaxCount])
    .range([0, 75])



  ////////////
  //////new timeline update
  d3.selectAll(".timelineRect").style("pointer-events", "none").classed("timelineRectSelected", false)
  d3.select("#timelineselectedyear").text(timelineInterval[0] + "—" + timelineInterval[1])
  d3.select("#timelinetitlecategory").text("Personen")

  d3.selectAll(".axisRectangles").selectAll(".timelineRect")
    .transition()
    .attr("width", timelineScale(timelineInterval[0] + 50) - timelineScale(timelineInterval[0])) //breite für 50 Jahre
    .attr("x", function(d) {
      return timelineScale(d)
    })

  d3.selectAll(".axisRectangles").selectAll("text")
    .transition()
    .attr("x", function(d) {
      return timelineScale(d)
    })

  d3.selectAll(".areachartGroup").selectAll("path").remove()

  timelineYScale = d3.scaleLinear()
    .domain([0, timelineMaxCount + 20])
    .range([timelineHeight, 0])

  areaGraphRelationAll = d3.area()
    .x(function(d, i) {
      return timelineScale(d.date);
    })
    .y0(function(d) {
      return timelineYScale(0)
    })
    .y1(function(d) {
      return timelineYScale(d.countPerson)
    })
    .curve(d3.curveBasis);

  d3.selectAll(".areachartGroup").append("path")
    .datum(timeline.filter(function(d) {
      return d != undefined
    }))
    .attr("d", areaGraphRelationAll)
    .style("fill", colorScaleEdges("Comp"))
    .style("opacity", 1)
    .style("stroke", "white")
    .style("stroke-width", 1)
    .attr("class", "timelineareaAllRelations")

  ////////////
  //////new timeline update Ende




  ////////////timeline end





}

function timelinebrushed() {
  if (d3.event.selection !== null) {

    brushStart = Math.round(timelineScale.invert(d3.event.selection[0]))
    brushEnd = Math.round(timelineScale.invert(d3.event.selection[1]))

    d3.select("#timelineselectedyear")
      .text(brushStart + "—" + brushEnd)

    let connectedNodes = []

    d3.selectAll(".link").classed("timefilteredOut", true)

    d3.selectAll(".nodes")
      .classed("timefilteredOut", true)
      .filter(function(d, i) {
        return d.Label == "PerName"
      })
      .filter(function(d, i) {
        return (d.DateApproxBegin <= brushStart && d.DateApproxBegin >= brushEnd) ||
          (d.DateApproxBegin >= brushStart && d.DateApproxBegin <= brushEnd) ||
          (d.DateApproxBegin <= brushStart && d.DateApproxEnd >= brushStart)
      })
      .classed("timefilteredOut", false)
      .each(function(D, I) {

        connectedNodes.push(
          D.id)

      })

    d3.selectAll(".link")
      .filter(function(E, G) {
        return connectedNodes.filter(function(d) {
          return d == E._source.id
        }).length > 0 && connectedNodes.filter(function(d) {
          return d == E._target.id
        }).length > 0
      })
      .classed("timefilteredOut", false)



  } else {
    brushStart = null
    brushEnd = null

    d3.select("#timelineselectedyear").text(timelineInterval[0] + "—" + timelineInterval[1])

    d3.selectAll(".nodes").classed("timefilteredOut", false)
    d3.selectAll(".link").classed("timefilteredOut", false)

  }

}


function ticked() {
  if (simulation.alpha() < 0.05) {
    simulation.stop()

    //after simulation has cooled down use netclustering to identify clusters in the data. each node will get assigned a cluster property after that
    netClustering.cluster(graph.nodes, linksClean);

    graph.nodes.sort(function(a, b) {
      return a.cluster - b.cluster || a.DateApproxBegin2 - b.DateApproxBegin2
    });

    ///order nodes by time and assigne an index for that for later use
    graph.nodes.filter(function(d) {
      return d.Label == "PerName" && d.DateApproxBegin2 != 0
    }).forEach(function(d, i) {
      d.temporalIndex = i;
    })

    console.log(graph.nodes)

    d3.select("#load").style("display", "none");
    d3.select("#loadbg").style("display", "none");


    d3.selectAll(".link")
      .attr("d", function(d) {
        var dr = 10000 /// d.linknum;
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
      })


    d3.selectAll(".nodes")
      .attr("x", function(d) {
        return d.x - nodeSize(d.connectivityClean) / 2;
      })
      .attr("y", function(d) {
        return d.y - nodeSize(d.connectivityClean) / 2;
      });

  }
}


/////////////////////////////////
//morph to timeline function

function morphToTimeline() {
  mode = "timeline"

  d3.select("#morphToTimeline").style("display", "none")
  d3.select("#morphToGraph").style("display", "block")
  d3.select(".searchbar").style("display", "none")

  svgG.transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity);

  zoomlevel = 1

  let temporalScale = d3.scaleLinear()
    .domain([timelineInterval[0] - 50, timelineInterval[1] + 50])
    .range([0, window.innerWidth]);

  let tickNo = timelineInterval[0] - 200 + timelineInterval[1] + 100

  var x_axis = d3.axisBottom()
    .tickFormat(d3.format("d"))
    .ticks(20)
    .scale(temporalScale);

  var x_axis2 = d3.axisBottom()
    .tickFormat(d3.format("d"))
    .scale(temporalScale)
    .ticks(40)
    .tickSize(20000);

  d3.selectAll("#graph").selectAll(".tick").selectAll("text").style("dy", 0)



  d3.selectAll(".axistime").transition().duration(750)

  d3.select("#graph").select(".svgG").append("g").lower().classed("axistime", true)
    .call(x_axis);

  d3.select("#graph").select(".svgG").append("g").lower().classed("axistime", true)
    .call(x_axis2);

  d3.selectAll(".nodes")
    .filter(function(d) {
      return d.Label != "PerName" || d.DateApproxBegin2 == 0
    })
    .style("display", "none")

  d3.selectAll(".nodes")
    .filter(function(d) {
      return d.Label == "PerName" && d.DateApproxBegin2 != 0
    })
    .style("display", function(d) {
      if (d.DateApproxBegin2 == 0 || d.Label != "PerName") {
        return "none"
      }
    })
    .transition()
    .duration(2000)
    .attr("rx", function(d, i) {
      return 2 //height number because"If rx is greater than half of the width of the rectangle, then the browser will consider the value for rx as half of the width of the rectangle."
    })
    .attr("x", function(d) {
      if (d.DateApproxBegin2) {
        return temporalScale(d.DateApproxBegin2)
      } else {
        return -200
      }
    })
    .attr("y", function(d, i) {
      if (d.temporalIndex == 0) {
        return 40 + (9 * d.temporalIndex)
      } else {
        return 40 + (9 * d.temporalIndex)
      }
    })
    .attr("width", function(d) {
      if (d.DateApproxBegin2 && d.DateApproxEnd2) {
        return (temporalScale(Number(d.DateApproxEnd2)) - temporalScale(Number(d.DateApproxBegin2))) > 5 ? (temporalScale(Number(d.DateApproxEnd2)) - temporalScale(Number(d.DateApproxBegin2))) : 5
      } else if (d.Label == "PerName" && d.DateApproxBegin2 > 1900) {
        return (temporalScale(2021) - temporalScale(Number(d.DateApproxBegin2))) > 5 ? (temporalScale(Number(2021)) - temporalScale(Number(d.DateApproxBegin2))) : 5
      } else {
        return 5
      }
    })
  ////adding labels to the timeline nodes (for now taken out)
  // .each(function(d){
  //   d3.select(".nodeG")
  //   .append("text")
  //   .text(d.Name)
  //   .style("font-size", 6)
  //   .style("fill", "rgb(199, 197, 197)")
  //   .style("text-transform", "uppercase")
  //   .attr("dy", 5)
  //   .attr("dx", 2)
  //   .attr("y", function() {
  //     if (d.temporalIndex == 0){
  //         return 40+(9 * d.temporalIndex)
  //     }else{
  //       return 40+(9 * d.temporalIndex)
  //     }
  //   })
  //   .attr("x", function(){
  //     if (d.DateApproxBegin2 && d.DateApproxEnd2) {
  //             return temporalScale(d.DateApproxEnd2)
  //           } else if(d.Label == "PerName" && d.DateApproxBegin2 > 1900){
  //             return temporalScale(d.DateApproxBegin2)+(temporalScale(2021) - temporalScale(Number(d.DateApproxBegin2)))>5?(temporalScale(Number(2021)) - temporalScale(Number(d.DateApproxBegin2))):5
  //         } else {
  //             return temporalScale(d.DateApproxBegin2)+5
  //           }})
  // })




  d3.selectAll(".link").transition().duration(2000).style("opacity", 0.3).style("display", function(d) {
      if (d.source.DateApproxBegin2 == 0 || d.target.DateApproxBegin2 == 0 || d.source.Label != "PerName" || d.target.Label != "PerName") {
        return "none"
      }
    })
    .filter(function(d) {
      return d.source.Label == "PerName" && d.target.Label == "PerName" && d.source.DateApproxBegin2 != 0 && d.target.DateApproxBegin2 != 0
    })
    .attr("d", function(d) {

      let dr = 2

      let nodeAx = d.source.DateApproxBegin2 != 0 ? temporalScale(d.source.DateApproxBegin2) : -200


      let nodeAI = graph.nodes.filter(function(D, I) {
        return D.Id == d.source.Id
      })[0].temporalIndex



      let nodeBx = d.target.DateApproxBegin2 != 0 ? temporalScale(d.target.DateApproxBegin2) : -200


      let nodeBI = graph.nodes.filter(function(D, I) {
        return D.Id == d.target.Id
      })[0].temporalIndex


      if (nodeAI < nodeBI) {
        return "M" + nodeBx + "," + (43 + (9 * nodeBI)) + "A" + dr + "," + dr + " 0 0,1 " + nodeAx + "," + (43 + (9 * nodeAI))

      } else {
        return "M" + nodeAx + "," + (43 + (9 * nodeAI)) + "A" + dr + "," + dr + " 0 0,1 " + nodeBx + "," + (43 + (9 * nodeBI))

      }

    })



}

///////end morphtotimeline
/////////////////////////////////

///////start morphtograph
/////////////////////////////////
function morphToGraph() {
  mode = "graph"

  d3.select("#morphToTimeline").style("display", "block")
  d3.select("#morphToGraph").style("display", "none")
  d3.select(".searchbar").style("display", "flex")


  d3.selectAll(".axistime").remove()

  svgG.transition()
    .duration(750)
    .call(zoom.transform, d3.zoomIdentity);


  d3.selectAll(".axistime").transition().duration(750)
    .call(zoom.transform, d3.zoomIdentity);


  d3.selectAll(".link").style("display", null).transition().duration(2000).attr("d", function(d) {
    let dr = 10000

    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y
  })


  d3.selectAll(".nodes").transition().duration(2000)
    .attr("width", function(d, i) {
      return (zoomlevel > 1) ? (nodeSize(d.connectivityClean) / zoomlevel) : nodeSize(d.connectivityClean)
    })
    .attr("height", function(d, i) {
      return (zoomlevel > 1) ? (nodeSize(d.connectivityClean) / zoomlevel) : nodeSize(d.connectivityClean)
    })
    .attr("x", function(d, i) {
      return d.x - ((zoomlevel >= 1) ? (nodeSize(d.connectivityClean) / zoomlevel) : nodeSize(d.connectivityClean)) / 2;
    })
    .attr("y", function(d, i) {
      return d.y - ((zoomlevel >= 1) ? (nodeSize(d.connectivityClean) / zoomlevel) : nodeSize(d.connectivityClean)) / 2;
    })
    .attr("rx", function(d, i) {
      if (d.Label == "PerName") {
        return 1000 //height number because"If rx is greater than half of the width of the rectangle, then the browser will consider the value for rx as half of the width of the rectangle."
      } else {
        return 0
      }
    })
    .style("display", null)


}

///////end morphtograph
/////////////////////////////////

function edgeClick(D, I) {
  d3.select("#details").style("display", "none").selectAll("p").remove()
  d3.select("#details").style("display", "none").selectAll("a").remove()
  d3.select("#details").style("display", "none").selectAll("ul").remove()
  d3.select("#details").style("display", "none").selectAll("li").remove()


  d3.select("#closedetails").style("display", "block")
  d3.select("#details").style("display", "block")

  d3.select("#details").append("p").attr("class", "detail_key").text("Beziehung:")
  d3.select("#details").append("p").attr("class", "detail_value").style("margin-bottom", 0).text(D._source.Name).on("click", function() {

    detailview = true;
    mouseClick(D._source)
  })
  d3.select("#details").append("p").attr("class", "detail_value").text(D._target.Name).on("click", function() {

    detailview = true;
    mouseClick(D._target)
  })

  d3.select("#details").append("p").attr("class", "relationsheadline, detail_key").text("Beziehungsquellen" + " (" + D.children.length + ")")
  d3.select("#details").append("ul").attr("class", "detailEdgeList")

  D.children.sort(function(a, b) {
      return d3.ascending(a.linkDateDateApproxBegin, b.linkDateDateApproxBegin || d3.ascending(a.originType, b.originType))
    })
    .forEach(function(connection, i) {
      d3.select(".detailEdgeList").append("a").attr("href", connection.originUri).attr("target", "_blank").attr("class", "detail_value, relations_value").append("li")
        .classed(connection.originType, true)
        .text(function() {
          return nodes.filter(function(n) {
            return n.Id == connection.originId
          })[0] ? nodes.filter(function(n) {
            return n.Id == connection.originId
          })[0].Name : "GND Relation: " + connection._source.Name + " → " + connection._target.Name

        })
        .append("span")
        .style("margin-left", "4px")
        .style("color", "black")
        .style("font-weight", "300")
        .text(function() {
          return "(" + connection.originType + ", " + connection.SourceType +
            ", " + connection.TypeAddInfo
            //+ ", " + connection.TempValidity
            +
            (connection.linkDateDateApproxBegin != undefined ? (", " + connection.linkDateDateApproxBegin) : "") +
            ((connection.linkDateDateApproxEnd != undefined) ? ("–" + connection.linkDateDateApproxEnd + ")") : ")")
        })

    })

}



function mouseClick(D, I) {
  d3.select("#details").style("display", "none").selectAll("p").remove()
  d3.select("#details").style("display", "none").selectAll("a").remove()
  d3.select("#details").style("display", "none").selectAll("li").remove()
  d3.select("#details").style("display", "none").selectAll("ul").remove()


  d3.select("#closedetails").style("display", "block")
  d3.selectAll(".nodes").classed("filteredIn", false).classed("filteredOut", true)
  d3.selectAll(".linkChild").remove()
  d3.selectAll(".link").style("opacity", null)
  d3.selectAll(".nodes").style("opacity", null)


  let connections = linksClean.filter(function(E, G) {
    return E._source.id == D.id ||
      E._target.id == D.id
  })


  let allConnections = links.filter(function(E, G) {
    return E._source.id == D.id ||
      E._target.id == D.id
  })


  let connectedNodes = []



  allConnections.forEach(function(E, G) {
    d3.selectAll(".nodes").filter(function(X, Y) {
        return X.id == E._source.id || X.id == E._target.id
      }).classed("filteredIn", true).classed("filteredOut", false)
      .each(function(X, Y) {
        connectedNodes.push(
          X.id
        )
      })


    d3.selectAll(".nodes")
      .filter(function(d, i) {
        return D.id == d.id
      }).classed("filteredIn", true).classed("filteredOut", false)


  })




  d3.selectAll(".link").style("opacity", 0)

  d3.selectAll(".link")

    .filter(function(E, G) {
      return connectedNodes.filter(function(d) {
        return d == E._source.id
      }).length > 0 && connectedNodes.filter(function(d) {
        return d == E._target.id
      }).length > 0
    })
    .style("opacity", 1)



  d3.select("#details").style("display", "block")

  Object.entries(D).forEach(entry => {
    let key = entry[0];
    let value = entry[1];

    if (value != "" && value != null && key != "x" && key != "y" && key != "vx" && key != "vy" && key != "index" && key != "connectivity" && key != "connectivityPerCorp"
    && key!="GenType" && key!="SpecType" && key!="DateApproxBegin" && key!="DateApproxBegin2" && key!="DateApproxEnd" && key!="DateApproxEnd2" && key!="connectivityClean" && key !="temporalIndex" && key != "cluster" && key != "n4jID" && key != "id") {
      if (key != "Uri" && key != "Gender") {
        d3.select("#details").append("p").attr("class", "detail_key").text(key)
        d3.select("#details").append("p").attr("class", "detail_value").text(function(){if(typeof value === "string" && value.includes(";;;")){return value.replace(/;;;/g, "; ")}else{return value}})

      } else if (key == "Gender") {
        d3.select("#details").append("p").attr("class", "detail_key").text(key)
        d3.select("#details").append("p").attr("class", "detail_value").text(function(){if(value == "1"){return "männlich"}else if(value == "2"){return "weiblich"}else{return "keine Angabe"}})

      } else {
        d3.select("#details").append("p").attr("class", "detail_key").text(key)
        d3.select("#details").append("a").attr("href", value).attr("target", "_blank").attr("class", "detail_value").text(function(){if(typeof value === "string" && value.includes(";;;")){return value.replace(/;;;/g, "; ")}else{return value}})
      }

    }


  });

  if (D.Label != "GeoName" && allConnections.filter(function(x, y) {return x.type == "RelationToGeoName"}).length >0){
    d3.select("#details").append("p").attr("class", "relationsheadline, detail_key").text("Verbundene Orte")

    d3.select("#details").append("ul").attr("class", "detailGeoList")

    allConnections.filter(function(x, y) {
      return x.type == "RelationToGeoName"
    }).forEach(function(connection, i) {
      d3.select(".detailGeoList").append("li").attr("class", "detail_value, relations_value").style("color", "black")
        .text(function() {
          return connection._target.Name + " (" + connection.SourceType + ")"
        })
    })
  }


  if (D.Label != "TopicTerm" && allConnections.filter(function(x, y) {return x.type == "RelationToTopicTerm"}).length >0){
  d3.select("#details").append("p").attr("class", "relationsheadline, detail_key").text("Verbundene Sachbegriffe")
  d3.select("#details").append("ul").attr("class", "detailTopicList")

  allConnections.filter(function(x, y) {
    return x.type == "RelationToTopicTerm"
  }).forEach(function(connection, i) {
    d3.select(".detailTopicList").append("li").attr("class", "detail_value, relations_value").style("color", "black")
      .text(function() {
        return connection._target.Name + " (" + connection.SourceType + ")"
      })
  })
}

  if (D.Label != "Resource" && allConnections.filter(function(x, y) {return x._source.Label == "Resource" || x._target.Label == "Resource"}).length >0){
  d3.select("#details").append("p").attr("class", "relationsheadline, detail_key").text("Verbundene Ressourcen")
  d3.select("#details").append("ul").attr("class", "detailResourceList")


  allConnections.filter(function(x, y) {
    return x._source.Label == "Resource" || x._target.Label == "Resource"
  }).forEach(function(connection, i) {
    d3.select(".detailResourceList").append("li").attr("class", "detail_value, relations_value").style("color", "black")
      .text(function() {
        return connection._source.Name + " (" + connection.SourceType + ", " + connection.Source +
          ", " + connection.TypeAddInfo + ", " + connection.TempValidity + ")"
      })
  })
}

  d3.select("#details").append("p").attr("class", "relationsheadline, detail_key").text("Verbundene Personen")
  d3.select("#details").append("ul").attr("class", "detailPerList")

  if (D.Label == "PerName"){
    connections.filter(function(x, y) {
        return x._source.Label == "PerName"
      })
      .sort((a, b) => d3.descending(a.children.length, b.children.length))
      .forEach(function(connection, i) {
        d3.select(".detailPerList").append("li").attr("class", "detail_value, relations_value")
          .text(function() {
              return connection._target.Name + " (" + connection.children.length + ")"
          })
      })
  }
  if (D.Label == "CorpName"){
    connections.filter(function(x, y) {
        return x._source.Label == "PerName" && x._target.Label == "CorpName"
      })
      .sort((a, b) => d3.descending(a.children.length, b.children.length))
      .forEach(function(connection, i) {
        d3.select(".detailPerList").append("li").attr("class", "detail_value, relations_value")
          .text(function() {
            if (D.Id == connection._source.Id) {
              return connection._source.Name + " (" + connection.children.length + ")"
            } else {
              return connection._source.Name + " (" + connection.children.length + ")"
            }

          })
      })
  }
  if (D.Label != "PerName" && D.Label != "CorpName" && D.Label != "Resource"){
    allConnections.filter(function(x, y) {
        return x._source.Label == "PerName"
      })
      .forEach(function(connection, i) {
        d3.select(".detailPerList").append("li").attr("class", "detail_value, relations_value")
          .text(function() {
              return connection._source.Name + " (" + connection.SourceType + ")"
          })
      })
  }
  if (D.Label == "Resource"){
    allConnections.filter(function(x, y) {
        return x._target.Label == "PerName"
      })
      .forEach(function(connection, i) {
        d3.select(".detailPerList").append("li").attr("class", "detail_value, relations_value")
          .text(function() {
              return connection._target.Name
          })
      })
  }


  if (D.Label == "PerName"){
  d3.select("#details").append("p").attr("class", "relationsheadline, detail_key").text("Verbundene Körperschaften")
  d3.select("#details").append("ul").attr("class", "detailCorpList")

  connections.filter(function(x, y) {
    return x._source.Label == "CorpName" || x._target.Label == "CorpName"
  }).forEach(function(connection, i) {
    d3.select(".detailCorpList").append("li").attr("class", "detail_value, relations_value").style("color", function() {
      if (connection.type == "SocialRelation") {
        return "black"
      } else {
        return "black"
      }
    }).text(function() {
      if (D.Id == connection._source.Id) {
        return connection._target.Name + " (" + connection.children.length + ")"
      } else {
        return connection._source.Name + " (" + connection.children.length + ")"
      }

    })
  })
}

}


function mouseOut(D, I) {
  if (detailview != true) {
    if (mode == "graph") {
      d3.select("#graph").transition().duration(750).call(zoom.transform, d3.zoomIdentity)
    }

    d3.select("#closedetails").style("display", "none")

    d3.selectAll(".filterCross").remove()
    d3.selectAll(".nodes").classed("filteredIn", true).classed("filteredOut", false).classed("notedgerelevant", false)

    d3.selectAll(".link").style("opacity", 1)
    d3.selectAll(".nodesOnTop").remove()
    d3.selectAll(".linkChild").remove()
    d3.selectAll(".link").style("opacity", null)

    if (mode == "graph") {
      d3.selectAll(".nodes").style("opacity", null)
        .attr("width", function(d, i) {
          if (mode == "graph")
            return (zoomlevel >= 1) ? (nodeSize(d.connectivityClean) / zoomlevel) : nodeSize(d.connectivityClean)
        })
        .attr("height", function(d, i) {
          return (zoomlevel >= 1) ? (nodeSize(d.connectivityClean) / zoomlevel) : nodeSize(d.connectivityClean)
        })
    }

    d3.selectAll(".nodes").style("opacity", null)
      .style("fill", function(d, i) {
        if (($('#search_category_select').val() == "GND-ID") && d.Id == $('#suche').val()) {
          return color("Selection")
        } else if (d.Label == "PerName") {
          return color(d.Label)
        } else {
          return color(d.Label)
        }
      })






    d3.select("#details").style("display", "none").selectAll("p").remove()
  }
}

function idIndex(a, id) {
  for (let i = 0; i < a.length; i++) {
    if (a[i].id == id) {
      return i
    }
  }
  return null;
}

///setupNetwork vis end
////////////////////////////////////




const _2PI = 2 * Math.PI;


let svg1id = "#vis"
let svg2id = "#visgeo"
let svg3id = "#visres"
let svg4id = "#vismeet"
let svg5id = "#visuni"
let svg6id = "#viscorp"

var svgWidth = window.innerWidth,
  svgHeight = window.innerHeight,
  marginOverview = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  height = svgHeight - marginOverview.top - marginOverview.bottom,
  width = svgWidth - marginOverview.left - marginOverview.right,
  halfWidth = width / 2,
  halfHeight = height / 2,
  quarterWidth = width / 4,
  quarterHeight = height / 4,
  titleY = 20,
  PerNameCenter = [halfWidth, halfHeight]
GeoNameCenter = [3 / 4 * width, halfHeight]
ResourcesCenter = [quarterWidth, halfHeight]
MeetNameCenter = [0.35 * width, 0.25 * height]
UniTitleCenter = [halfWidth, 0.2 * height]
CorpNameCenter = [0.65 * width, 0.25 * height]


let windowWidthOverview = window.innerWidth - 2 * marginOverview.left
let windowHeightOverview = window.innerHeight - 2 * marginOverview.top

let zoomOverview = d3.zoom()
  .scaleExtent([1 / 3, 8])
  .on("zoom", zoomedOverview)

function zoomedOverview() {
  d3.select("#allvisg").attr("transform", d3.event.transform);
}

const svgOverview = d3.select("#svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("preserveAspectRatio", "xMidYMid")
  .attr("viewBox", "0 0 " + windowWidthOverview + " " + windowHeightOverview)
  .call(zoomOverview)




const timelineVis = d3.select("#timelineSVG")
  .attr("width", "100%")
  .attr("height", "100%")


let totalCount = 0
let totalCountGeo = 0
let totalCountRes = 0
let totalCountMeet = 0
let totalCountUni = 0
let totalCountCorp = 0


let Radius
let RadiusGeo
let RadiusRes
let RadiusMeet
let RadiusUni
let RadiusCorp
let CirclingPolygon
let CirclingPolygonGeo
let CirclingPolygonRes
let CirclingPolygonMeet
let CirclingPolygonUni
let CirclingPolygonCorp
let Polygons
let PolygonsGeo
let PolygonsRes
let PolygonsMeet
let PolygonsUni
let PolygonsCorp


let top100Value = 0
let top100ValueGeo = 0
let top100ValueRes = 0
let top100ValueMeet = 0
let top100ValueUni = 0
let top100ValueCorp = 0
let otherValue = 0
let otherValueGeo = 0
let otherValueRes = 0
let otherValueMeet = 0
let otherValueUni = 0
let otherValueCorp = 0
let totalValue = 0
let totalValueGeo = 0
let totalValueRes = 0
let totalValueMeet = 0
let totalValueUni = 0
let totalValueCorp = 0



const radiusScale = d3.scaleSqrt()
  .domain([0, 8000000])
  .range([50, 250])

const colorScale = d3.scaleOrdinal()
  .range(['#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525'])

const colorScaleEdges = d3.scaleOrdinal()
  .domain(["GND", "KPE", "DNB", "SBB", "ZDB", "Comp"])
  .range(["var(--GND)", "var(--KPE)", "var(--DNB)", "var(--SBB)", "var(--ZDB)", "var(--Comp)"])

const edgesSizeScale = d3.scaleLinear()
  .domain([0, 1, 8000000])
  .range([0, 4, 50])

let yearSelected = 1850
let selectionData
let selectionDataState

let selectionDataGeo
let selectionDataStateGeo

let selectionDataRes
let selectionDataStateRes

let selectionDataMeet
let selectionDataStateMeet

let selectionDataUni
let selectionDataStateUni

let selectionDataCorp
let selectionDataStateCorp

///load data
Promise.all([
    d3.csv("assets/data/persontopicterms_50er_long-komp.csv"), //data
    d3.csv("assets/data/persongeonames_50er_long_komp.csv"), //geodata
    d3.csv("assets/data/resourcetopic_50er_long_komp.csv"), //ressources
    d3.csv("assets/data/meetnametopic_50er_long_komp.csv"), //meetname
    d3.csv("assets/data/unititletopic_50er_long_komp.csv"), //unititle
    d3.csv("assets/data/corpname_50er_long_komp.csv"), //corpname
    d3.csv("assets/data/all-relations160821_final.csv"),
    d3.csv("assets/data/all-timeline-relations.csv"),//timeline
  ])
  .then(([data, geodata, resdata, meetdata, unidata, corpdata, relationdata, timelinerelations]) => {

//parse data
    data.forEach(function(d) {
      d.entityName = d.entityName;
      d.value = +d.value;
      d.year = +d.year;

      totalCount += d.value;
      return d;
    });

    geodata.forEach(function(d) {
      d.entityName = d.entityName;
      d.value = +d.value;
      d.year = +d.year;

      totalCountGeo += d.value;
      return d;
    });

    resdata.forEach(function(d) {
      d.entityName = d.entityName;
      d.value = +d.value;
      d.year = +d.year;

      totalCountRes += d.value;
      return d;
    });

    meetdata.forEach(function(d) {
      d.entityName = d.entityName;
      d.value = +d.value;
      d.year = +d.year;

      totalCountRes += d.value;
      return d;
    });

    unidata.forEach(function(d) {
      d.entityName = d.entityName;
      d.value = +d.value;
      d.year = +d.year;

      totalCountUni += d.value;
      return d;
    });

    corpdata.forEach(function(d) {
      d.entityName = d.entityName;
      d.value = +d.value;
      d.year = +d.year;

      totalCountCorp += d.value;
      return d;
    });

    timelinerelations.forEach(function(d) {
      d.PerPer_GND = +d.PerPer_GND;
      d.CorpPer_GND = +d.CorpPer_GND;
      d.GeoPer_GND = +d.GeoPer_GND;
      d.MeetPer_GND = +d.MeetPer_GND;
      d.UniPer_GND = +d.UniPer_GND;

      d.ResPer_KPE = +d.ResPer_KPE;
      d.ResPer_DNB = +d.ResPer_DNB;
      d.ResPer_SBB = +d.ResPer_SBB;
      d.ResPer_ZDB = +d.ResPer_ZDB;

      d.PerPer_Comp = +d.PerPer_Comp;
      d.CorpPer_Comp = +d.CorpPer_Comp;
    })

    //make timelinedata accesible outsite function
    timelinerelationsData = timelinerelations

    //call data processing function
    updateData(data, geodata, resdata, meetdata, unidata, corpdata, yearSelected)


    /////overview timeline Start
    ///////////////////////////////////
    ///set up scales
    timelineScale = d3.scaleLinear()
      .domain(timelineInterval)
      .range([0, windowWidth]);

    timelineYScale = d3.scaleLinear()
      .domain([0, 13000000])
      .range([timelineHeight, 0])


    areaGND = d3.area()
      .x(function(d, i) {
        return timelineScale(d.year);
      })
      .y0(function(d) {
        return timelineYScale(0)
      })
      .y1(function(d) {
        return timelineYScale(d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .curve(d3.curveBasis);

    areaKPE = d3.area()
      .x(function(d, i) {
        return timelineScale(d.year);
      })
      .y0(function(d) {
        return timelineYScale(d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .y1(function(d) {
        return timelineYScale(d.ResPer_KPE + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .curve(d3.curveBasis);

    areaDNB = d3.area()
      .x(function(d, i) {
        return timelineScale(d.year);
      })
      .y0(function(d) {
        return timelineYScale(d.ResPer_KPE + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .y1(function(d) {
        return timelineYScale(d.ResPer_DNB + d.ResPer_KPE + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .curve(d3.curveBasis);

    areaSBB = d3.area()
      .x(function(d, i) {
        return timelineScale(d.year);
      })
      .y0(function(d) {
        return timelineYScale(d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .y1(function(d) {
        return timelineYScale(d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .curve(d3.curveBasis);


    areaZDB = d3.area()
      .x(function(d, i) {
        return timelineScale(d.year);
      })
      .y0(function(d) {
        return timelineYScale(d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .y1(function(d) {
        return timelineYScale(d.ResPer_ZDB + d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .curve(d3.curveBasis);

    areaComp = d3.area()
      .x(function(d, i) {
        return timelineScale(d.year);
      })
      .y0(function(d) {
        return timelineYScale(d.ResPer_ZDB + d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .y1(function(d) {
        return timelineYScale(d.PerPer_Comp + d.CorpPer_Comp + d.ResPer_ZDB + d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .curve(d3.curveBasis);


    let areachartGroup = timelineVis.append("g").attr("class", "areachartGroup") //.attr("transform", "translate(" + 116 + "," + timelineMarginTop + ")")

    let areachart = d3.selectAll(".areachartGroup")

    let areachartRectangles = areachart.append("g").attr("class", "axisRectangles")

    let timelinebrush = areachart.append("g").attr("class", "timelinebrush").style("display", function() {
      if (mode == "overview") {
        return "none"
      } else {
        return "block"
      }
    })


    brushTimelineX = d3.brushX()
      .extent([[0, 0],[windowWidth, timelineHeight]])
      .on("brush", timelinebrushed)
      .on("end", timelinebrushed)

    timelinebrush.call(brushTimelineX)

    let rectI = -2000
    while (rectI <= 2100) {

      areachartRectangles.append("rect")
        .datum(rectI)
        .attr("height", timelineHeight)
        .attr("width", timelineScale(1350) - timelineScale(1300)) //breite für 50 Jahre
        .attr("x", timelineScale(rectI))
        .attr("y", 0)
        .classed("timelineRect", true)
        .classed("timelineRectSelected", function() {
          if (rectI == yearSelected) {
            return true
          } else {
            return false
          }
        })
        .attr("data-year", rectI)
        .on("mouseover", function(d) {
          d3.select(this)
            .classed("timelineRecthover", true)
        })
        .on("mouseout", function(d) {
          d3.select(this)
            .classed("timelineRecthover", false)
        })
        .on("click", function(d) {
          d3.selectAll(".timelineRect").classed("timelineRectSelected", false)
          d3.select(this).classed("timelineRectSelected", true)
          yearSelected = d3.select(this).attr("data-year")
          d3.select("#timelineselectedyear").text(yearSelected + "—" + (+yearSelected + 50))
          updateData(data, geodata, resdata, meetdata, unidata, corpdata, yearSelected)
          updateRelations(relationdata)
        })


      areachartRectangles.append("text")
        .datum(rectI)
        .text(rectI)
        .attr("y", 12)
        .attr("x", timelineScale(rectI))
        .style("font-size", 10)
        .style("font-weight", 500)
        .style("fill", "black")
        .style("stroke", "#fafafa")
        .style("stroke-width", 4)
        .style("stroke-linecap", "round")
        .style("text-anchor", "middle")

      areachartRectangles.append("text")
        .datum(rectI)
        .text(rectI)
        .attr("y", 12)
        .attr("x", timelineScale(rectI))
        .style("font-size", 10)
        .style("font-weight", 500)
        .style("fill", "black")
        .style("text-anchor", "middle")

      rectI = rectI + 50
    }

    ///small black line above timeline
    areachartRectangles.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", 1)
      .attr("width", "100%")
      .style("fill", "#737373")


    areachart.append("g").attr("class", "axisTime")
    d3.selectAll(".tick").selectAll("text")
      .attr("transform", "translate(" + [0, -timelineHeight] + ")");

    areachart.append("path")
      .datum(timelinerelations)
      .attr("d", areaGND)
      .style("fill", colorScaleEdges("GND"))
      .style("opacity", 1)
      .style("stroke", "white")
      .style("stroke-width", 1)
      .attr("class", "overviewareaGND")

    areachart.append("path")
      .datum(timelinerelations)
      .attr("d", areaKPE)
      .style("fill", colorScaleEdges("KPE"))
      .style("opacity", 1)
      .style("stroke", "white")
      .style("stroke-width", 1)
      .attr("class", "overviewareaKPE")

    areachart.append("path")
      .datum(timelinerelations)
      .attr("d", areaDNB)
      .style("fill", colorScaleEdges("DNB"))
      .style("opacity", 1)
      .style("stroke", "white")
      .style("stroke-width", 1)
      .attr("class", "overviewareaDNB")

    areachart.append("path")
      .datum(timelinerelations)
      .attr("d", areaSBB)
      .style("fill", colorScaleEdges("SBB"))
      .style("opacity", 1)
      .style("stroke", "white")
      .style("stroke-width", 1)
      .attr("class", "overviewareaSBB")

    areachart.append("path")
      .datum(timelinerelations)
      .attr("d", areaZDB)
      .style("fill", colorScaleEdges("ZDB"))
      .style("opacity", 1)
      .style("stroke", "white")
      .style("stroke-width", 1)
      .attr("class", "overviewareaZDB")

    areachart.append("path")
      .datum(timelinerelations)
      .attr("d", areaComp)
      .style("fill", colorScaleEdges("Comp"))
      .style("opacity", 1)
      .style("stroke", "white")
      .style("stroke-width", 1)
      .attr("class", "overviewareaComp")


    //overview timelineEnd
    //////////////////////////////


    ///relations edges Start
    //////////////////////////////
    let relationsYearSelected = yearSelected

    ///create lines between voronois

    let DNBResLineStrength = edgesSizeScale(relationdata.filter(function(d) {
      return d.year == relationsYearSelected && d.target == "Resource" && d.type == "DNB"
    })[0].value) / 2
    let KPEResLineStrength = edgesSizeScale(relationdata.filter(function(d) {
      return d.year == relationsYearSelected && d.target == "Resource" && d.type == "KPE"
    })[0].value) / 2
    let SBBResLineStrength = edgesSizeScale(relationdata.filter(function(d) {
      return d.year == relationsYearSelected && d.target == "Resource" && d.type == "SBB"
    })[0].value) / 2
    let ZDBResLineStrength = edgesSizeScale(relationdata.filter(function(d) {
      return d.year == relationsYearSelected && d.target == "Resource" && d.type == "ZDB"
    })[0].value) / 2
    let lineGap = 2

    let resPerRels = d3.select("#relationsvis").append("g").attr("class", "resPerRels").attr("transform", "translate(0," + (-((lineGap * 3) + DNBResLineStrength + KPEResLineStrength + SBBResLineStrength + ZDBResLineStrength) / 2) + ")")

    resPerRels.selectAll(".relationLine")
      .data(relationdata.filter(function(d) {
        return d.year == relationsYearSelected && d.target == "Resource"
      }))
      .join("line")
      .classed("relationLine", true)
      .attr("x1", d => PerNameCenter[0])
      .attr("y1", d => PerNameCenter[1])
      .attr("x2", function(d) {
        return ResourcesCenter[0]
      })
      .attr("y2", function(d) {
        return ResourcesCenter[1]
      })
      .attr("stroke", function(d) {
        return colorScaleEdges(d.type)
      })
      .attr("stroke-width", function(d) {
        return edgesSizeScale(d.value)
      })
      .attr("transform", function(d) {

        if (d.type == "DNB") {
          return "translate(0," + (0) + ")"
        } else if (d.type == "KPE") {
          return "translate(0," + (lineGap + DNBResLineStrength + KPEResLineStrength) + ")"
        } else if (d.type == "SBB") {
          return "translate(0," + (2 * lineGap + DNBResLineStrength + KPEResLineStrength * 2 + SBBResLineStrength) + ")"
        } else if (d.type == "ZDB") {
          return "translate(0," + (3 * lineGap + DNBResLineStrength + KPEResLineStrength * 2 + SBBResLineStrength * 2 + ZDBResLineStrength) + ")"
        }
      })


    let corpPerRels = d3.select("#relationsvis").append("g").attr("class", "corpPerRels") //.attr("transform", "translate(0,"+(-((lineGap*3)+DNBResLineStrength+KPEResLineStrength+SBBResLineStrength+ZDBResLineStrength)/2)+")")
    let CompCorpLineStrength = edgesSizeScale(relationdata.filter(function(d) {
      return d.year == relationsYearSelected && d.target == "CorpName" && d.type == "Comp"
    })[0].value) / 2
    let GNDCorpLineStrength = edgesSizeScale(relationdata.filter(function(d) {
      return d.year == relationsYearSelected && d.target == "CorpName" && d.type == "GND"
    })[0].value) / 2

    corpPerRels.selectAll(".relationLine")
      .data(relationdata.filter(function(d) {
        return d.year == relationsYearSelected && d.target == "CorpName"
      }))
      .join("line")
      .classed("relationLine", true)
      .attr("x1", d => PerNameCenter[0])
      .attr("y1", d => PerNameCenter[1])
      .attr("x2", function(d) {
        return CorpNameCenter[0]
      })
      .attr("y2", function(d) {
        return CorpNameCenter[1]
      })
      .attr("stroke", function(d) {
        return colorScaleEdges(d.type)
      })
      .attr("stroke-width", function(d) {
        return edgesSizeScale(d.value)
      })
      .attr("transform", function(d) {

        if (d.type == "Comp") {
          return "translate(0," + (CompCorpLineStrength) + ")"
        } else if (d.type == "GND") {
          return "translate(0," + (2 * lineGap + 2 * CompCorpLineStrength + GNDCorpLineStrength) + ")"
        }
      })



    let otherRels = d3.select("#relationsvis").append("g").attr("class", "otherRels")

    otherRels.selectAll(".relationLine")
      .data(relationdata.filter(function(d) {
        return d.year == relationsYearSelected && d.target != "PerName" && d.target != "Resource" && d.target != "CorpName"
      }))
      .join("line")
      .classed("relationLine", true)
      .attr("x1", d => PerNameCenter[0])
      .attr("y1", d => PerNameCenter[1])
      .attr("x2", function(d) {
        if (d.target == "GeoName") {
          return GeoNameCenter[0]
        } else if (d.target == "MeetName") {
          return MeetNameCenter[0]
        } else if (d.target == "UniTitle") {
          return UniTitleCenter[0]
        }
      })
      .attr("y2", function(d) {
        if (d.target == "GeoName") {
          return GeoNameCenter[1]
        } else if (d.target == "MeetName") {
          return MeetNameCenter[1]
        } else if (d.target == "UniTitle") {
          return UniTitleCenter[1]
        }
      })
      .attr("stroke", function(d) {
        return colorScaleEdges(d.type)
      })
      .attr("stroke-width", function(d) {
        return edgesSizeScale(d.value)
      })
      .attr("transform", function(d) {
        return "translate(0," + (edgesSizeScale(d.value)) + ")"
      })


    //PerName -- PerName Arcs

    let resPerPer = d3.select("#relationsvis").append("g").attr("class", "resPerPer") //.attr("transform", "translate(0,"+(-((lineGap*3)+DNBResLineStrength+KPEResLineStrength+SBBResLineStrength+ZDBResLineStrength)/2)+")")

    resPerPer.selectAll(".relationLine")
      .data(relationdata.filter(function(d) {
        return d.year == relationsYearSelected && d.target == "PerName"
      }))
      .join("path")
      .classed("relationLine", true)
      .attr("d", function(d) {
        let y1 = PerNameCenter[1]
        let x1 = PerNameCenter[0] - 30
        let CompLineStrength = edgesSizeScale(relationdata.filter(function(d) {
          return d.year == relationsYearSelected && d.target == "PerName" && d.type == "Comp"
        })[0].value) / 2

        if (d.type == "Comp") {
          return `M${x1},${y1} v ${Radius-20} c 0 60 60 60 60 0 v -${Radius-20}`
        } else if (d.type == "GND") {
          return `M${x1-CompLineStrength-4},${y1} v ${Radius-20} c 0 ${60+2*CompLineStrength+4} ${60+2*CompLineStrength+8} ${60+2*CompLineStrength+4}  ${60+2*CompLineStrength+8} 0 v -${Radius-20}`
        }
      })
      .attr("stroke-width", function(d) {
        return edgesSizeScale(d.value)
      })
      .attr("stroke", function(d) {
        return colorScaleEdges(d.type)
      })
      .style("fill", "none")


    ///relations edges End
    //////////////////////////////////////////////////

    /////////////////////////////////////////////
    ///Update Relations Function Start
    function updateRelations(relationdata) {
      relationsYearSelected = yearSelected

      DNBResLineStrength = edgesSizeScale(relationdata.filter(function(d) {
        return d.year == relationsYearSelected && d.target == "Resource" && d.type == "DNB"
      })[0].value) / 2
      KPEResLineStrength = edgesSizeScale(relationdata.filter(function(d) {
        return d.year == relationsYearSelected && d.target == "Resource" && d.type == "KPE"
      })[0].value) / 2
      SBBResLineStrength = edgesSizeScale(relationdata.filter(function(d) {
        return d.year == relationsYearSelected && d.target == "Resource" && d.type == "SBB"
      })[0].value) / 2
      ZDBResLineStrength = edgesSizeScale(relationdata.filter(function(d) {
        return d.year == relationsYearSelected && d.target == "Resource" && d.type == "ZDB"
      })[0].value) / 2
      lineGap = 2
      resPerRels = d3.select(".resPerRels").attr("transform", "translate(0," + (-((lineGap * 3) + DNBResLineStrength + KPEResLineStrength + SBBResLineStrength + ZDBResLineStrength) / 2) + ")")

      resPerRels.selectAll(".relationLine")
        .data(relationdata.filter(function(d) {
          return d.year == relationsYearSelected && d.target == "Resource"
        }))
        .transition()
        .attr("x1", d => PerNameCenter[0])
        .attr("y1", d => PerNameCenter[1])
        .attr("x2", function(d) {
          return ResourcesCenter[0]
        })
        .attr("y2", function(d) {
          return ResourcesCenter[1]
        })
        .attr("stroke", function(d) {
          return colorScaleEdges(d.type)
        })
        .attr("stroke-width", function(d) {
          return edgesSizeScale(d.value)
        })
        .attr("transform", function(d) {

          if (d.type == "DNB") {
            return "translate(0," + (0) + ")"
          } else if (d.type == "KPE") {
            return "translate(0," + (lineGap + DNBResLineStrength + KPEResLineStrength) + ")"
          } else if (d.type == "SBB") {
            return "translate(0," + (2 * lineGap + DNBResLineStrength + KPEResLineStrength * 2 + SBBResLineStrength) + ")"
          } else if (d.type == "ZDB") {
            return "translate(0," + (3 * lineGap + DNBResLineStrength + KPEResLineStrength * 2 + SBBResLineStrength * 2 + ZDBResLineStrength) + ")"
          }
        })


      resPerPer.selectAll(".relationLine")
        .data(relationdata.filter(function(d) {
          return d.year == relationsYearSelected && d.target == "PerName"
        }))
        .transition()
        .attr("d", function(d) {
          let y1 = PerNameCenter[1]
          let x1 = PerNameCenter[0] - 30
          let CompLineStrength = edgesSizeScale(relationdata.filter(function(d) {
            return d.year == relationsYearSelected && d.target == "PerName" && d.type == "Comp"
          })[0].value) / 2

          if (d.type == "Comp") {
            return `M${x1},${y1} v ${Radius-20} c 0 60 60 60 60 0 v -${Radius-20}`
          } else if (d.type == "GND") {
            return `M${x1-CompLineStrength-4},${y1} v ${Radius-20} c 0 ${60+2*CompLineStrength+4} ${60+2*CompLineStrength+8} ${60+2*CompLineStrength+4}  ${60+2*CompLineStrength+8} 0 v -${Radius-20}`
          }
        })
        .attr("stroke-width", function(d) {
          return edgesSizeScale(d.value)
        })
        .attr("stroke", function(d) {
          return colorScaleEdges(d.type)
        })
        .style("fill", "none")


      CompCorpLineStrength = edgesSizeScale(relationdata.filter(function(d) {
        return d.year == relationsYearSelected && d.target == "CorpName" && d.type == "Comp"
      })[0].value) / 2
      GNDCorpLineStrength = edgesSizeScale(relationdata.filter(function(d) {
        return d.year == relationsYearSelected && d.target == "CorpName" && d.type == "GND"
      })[0].value) / 2

      corpPerRels.selectAll(".relationLine")
        .data(relationdata.filter(function(d) {
          return d.year == relationsYearSelected && d.target == "CorpName"
        }))
        .transition()
        .attr("x1", d => PerNameCenter[0])
        .attr("y1", d => PerNameCenter[1])
        .attr("x2", function(d) {
          return CorpNameCenter[0]
        })
        .attr("y2", function(d) {
          return CorpNameCenter[1]
        })
        .attr("stroke", function(d) {
          return colorScaleEdges(d.type)
        })
        .attr("stroke-width", function(d) {
          return edgesSizeScale(d.value)
        })
        .attr("transform", function(d) {

          if (d.type == "Comp") {
            return "translate(0," + (CompCorpLineStrength) + ")"
          } else if (d.type == "GND") {
            return "translate(0," + (2 * lineGap + 2 * CompCorpLineStrength + GNDCorpLineStrength) + ")"
          }
        })


      otherRels.selectAll(".relationLine")
        .data(relationdata.filter(function(d) {
          return d.year == relationsYearSelected && d.target != "PerName" && d.target != "Resource" && d.target != "CorpName"
        }))
        .transition()
        .attr("x1", d => PerNameCenter[0])
        .attr("y1", d => PerNameCenter[1])
        .attr("x2", function(d) {
          if (d.target == "GeoName") {
            return GeoNameCenter[0]
          } else if (d.target == "MeetName") {
            return MeetNameCenter[0]
          } else if (d.target == "UniTitle") {
            return UniTitleCenter[0]
          }
        })
        .attr("y2", function(d) {
          if (d.target == "GeoName") {
            return GeoNameCenter[1]
          } else if (d.target == "MeetName") {
            return MeetNameCenter[1]
          } else if (d.target == "UniTitle") {
            return UniTitleCenter[1]
          }
        })
        .attr("stroke", function(d) {
          return colorScaleEdges(d.type)
        })
        .attr("stroke-width", function(d) {
          return edgesSizeScale(d.value)
        })
        .attr("transform", function(d) {
          return "translate(0," + (edgesSizeScale(d.value)) + ")"
        })

    }

    /////////////////////////////////////////////
    ///Update Relations Function End

    /////////////////////////////////////////////
    ///Update Data Function Start

    function updateData(data, geodata, resdata, meetdata, unidata, corpdata, yearSelected) {

      Radius
      CirclingPolygon
      Polygons
      RadiusGeo
      CirclingPolygonGeo
      PolygonsGeo
      RadiusRes
      CirclingPolygonRes
      PolygonsRes
      RadiusMeet
      CirclingPolygonMeet
      PolygonsMeet
      RadiusUni
      CirclingPolygonUni
      PolygonsUni
      RadiusCorp
      CirclingPolygonCorp
      PolygonsCorp

      top100Value = 0
      otherValue = 0
      totalValue = 0
      top100ValueGeo = 0
      otherValueGeo = 0
      totalValueGeo = 0
      top100ValueRes = 0
      otherValueRes = 0
      totalValueRes = 0
      top100ValueMeet = 0
      otherValueMeet = 0
      totalValueMeet = 0
      top100ValueUni = 0
      otherValueUni = 0
      totalValueUni = 0
      top100ValueCorp = 0
      otherValueCorp = 0
      totalValueCorp = 0


      selectionData = data.filter(function(d) {
        return d.year == yearSelected && d.value != ""
      })

      selectionDataGeo = geodata.filter(function(d) {
        return d.year == yearSelected && d.value != ""
      })

      selectionDataRes = resdata.filter(function(d) {
        return d.year == yearSelected && d.value != ""
      })

      selectionDataMeet = meetdata.filter(function(d) {
        return d.year == yearSelected && d.value != ""
      })

      selectionDataUni = unidata.filter(function(d) {
        return d.year == yearSelected && d.value != ""
      })

      selectionDataCorp = corpdata.filter(function(d) {
        return d.year == yearSelected && d.value != ""
      })


      selectionDataState = selectionData.sort((a, b) => d3.descending(a.value, b.value)).slice(0)
      selectionDataStateGeo = selectionDataGeo.sort((a, b) => d3.descending(a.value, b.value)).slice(0)
      selectionDataStateRes = selectionDataRes.sort((a, b) => d3.descending(a.value, b.value)).slice(0)
      selectionDataStateMeet = selectionDataMeet.sort((a, b) => d3.descending(a.value, b.value)).slice(0)
      selectionDataStateUni = selectionDataUni.sort((a, b) => d3.descending(a.value, b.value)).slice(0)
      selectionDataStateCorp = selectionDataCorp.sort((a, b) => d3.descending(a.value, b.value)).slice(0)


      selectionDataState.forEach(function(d, i) {
        totalValue += d.value
        if (i < 100) {
          top100Value += d.value
          d.show = true
        } else {
          otherValue += d.value
          d.show = false
        }
      })


      selectionDataState.push({
        entityName: "Sonstige",
        value: otherValue,
        show: true,
        year: yearSelected

      })

      selectionDataStateGeo.forEach(function(d, i) {
        totalValueGeo += d.value
        if (i < 100) {
          top100ValueGeo += d.value
          d.show = true
        } else {
          otherValueGeo += d.value
          d.show = false
        }
      })


      selectionDataStateGeo.push({
        entityName: "Sonstige",
        value: otherValueGeo,
        show: true,
        year: yearSelected

      })


      selectionDataStateRes.forEach(function(d, i) {
        totalValueRes += d.value
        if (i < 100) {
          top100ValueRes += d.value
          d.show = true
        } else {
          otherValueRes += d.value
          d.show = false
        }
      })


      selectionDataStateRes.push({
        entityName: "Sonstige",
        value: otherValueRes,
        show: true,
        year: yearSelected

      })

      selectionDataStateMeet.forEach(function(d, i) {
        totalValueMeet += d.value
        if (i < 100) {
          top100ValueMeet += d.value
          d.show = true
        } else {
          otherValueMeet += d.value
          d.show = false
        }
      })


      selectionDataStateMeet.push({
        entityName: "Sonstige",
        value: otherValueMeet,
        show: true,
        year: yearSelected

      })


      selectionDataStateUni.forEach(function(d, i) {
        totalValueUni += d.value
        if (i < 100) {
          top100ValueUni += d.value
          d.show = true
        } else {
          otherValueUni += d.value
          d.show = false
        }
      })


      selectionDataStateUni.push({
        entityName: "Sonstige",
        value: otherValueUni,
        show: true,
        year: yearSelected

      })

      selectionDataStateCorp.forEach(function(d, i) {
        totalValueCorp += d.value
        if (i < 100) {
          top100ValueCorp += d.value
          d.show = true
        } else {
          otherValueCorp += d.value
          d.show = false
        }
      })


      selectionDataStateCorp.push({
        entityName: "Sonstige",
        value: otherValueCorp,
        show: true,
        year: yearSelected

      })

      initData(data, geodata, resdata, meetdata, unidata, corpdata);
      //  initData(geodata);


      //simulation1 start
      Simulation = d3.voronoiMapSimulation(selectionDataState.filter(function(d, i) {
          return d.show == true
        }))
        .clip(CirclingPolygon)
        .weight(function(d) {
          return d.value
        })
        .initialPosition(d3.voronoiMapInitialPositionPie().startAngle(-Math.PI * 3 / 5))
        .on("tick", function() {
          Polygons = Simulation.state().polygons;
          if (Simulation.state().ended == true) {
            updateTreemap(svg1id, PerNameCenter, Polygons, totalValue, Radius, "Personen (")
          }
        })

      if (totalValueGeo > 0) {

        SimulationGeo = d3.voronoiMapSimulation(selectionDataStateGeo.filter(function(d, i) {
            return d.show == true
          }))
          .clip(CirclingPolygonGeo)
          .weight(function(d) {
            return d.value
          })
          .initialPosition(d3.voronoiMapInitialPositionPie().startAngle(-Math.PI * 3 / 5))
          .on("tick", function() {
            PolygonsGeo = SimulationGeo.state().polygons;
            if (SimulationGeo.state().ended == true) {
              updateTreemap(svg2id, GeoNameCenter, PolygonsGeo, totalValueGeo, RadiusGeo, "Geographika (")
            }
          })
      }

      if (totalValueRes > 0) {

        SimulationRes = d3.voronoiMapSimulation(selectionDataStateRes.filter(function(d, i) {
            return d.show == true
          }))
          .clip(CirclingPolygonRes)
          .weight(function(d) {
            return d.value
          })
          .initialPosition(d3.voronoiMapInitialPositionPie().startAngle(-Math.PI * 3 / 5))
          .on("tick", function() {
            PolygonsRes = SimulationRes.state().polygons;
            if (SimulationRes.state().ended == true) {
              updateTreemap(svg3id, ResourcesCenter, PolygonsRes, totalValueRes, RadiusRes, "Ressourcen (")
            }
          })
      }

      if (totalValueMeet > 0) {

        SimulationMeet = d3.voronoiMapSimulation(selectionDataStateMeet.filter(function(d, i) {
            return d.show == true
          }))
          .clip(CirclingPolygonMeet)
          .weight(function(d) {
            return d.value
          })
          .initialPosition(d3.voronoiMapInitialPositionPie().startAngle(-Math.PI * 3 / 5))
          .on("tick", function() {
            PolygonsMeet = SimulationMeet.state().polygons;
            if (SimulationMeet.state().ended == true) {
              updateTreemap(svg4id, MeetNameCenter, PolygonsMeet, totalValueMeet, RadiusMeet, "Veranstaltungen (")
            }
          })

      }


      if (totalValueUni > 0) {
        SimulationUni = d3.voronoiMapSimulation(selectionDataStateUni.filter(function(d, i) {
            return d.show == true
          }))
          .clip(CirclingPolygonUni)
          .weight(function(d) {
            return d.value
          })
          .initialPosition(d3.voronoiMapInitialPositionPie().startAngle(-Math.PI * 3 / 5))
          .on("tick", function() {
            PolygonsUni = SimulationUni.state().polygons;
            if (SimulationUni.state().ended == true) {
              updateTreemap(svg5id, UniTitleCenter, PolygonsUni, totalValueUni, RadiusUni, "Werke (")
            }
          })
      }



      if (totalValueCorp > 0) {
        SimulationCorp = d3.voronoiMapSimulation(selectionDataStateCorp.filter(function(d, i) {
            return d.show == true
          }))
          .clip(CirclingPolygonCorp)
          .weight(function(d) {
            return d.value
          })
          .initialPosition(d3.voronoiMapInitialPositionPie().startAngle(-Math.PI * 3 / 5))
          .on("tick", function() {
            PolygonsCorp = SimulationCorp.state().polygons;
            if (SimulationCorp.state().ended == true) {
              updateTreemap(svg6id, CorpNameCenter, PolygonsCorp, totalValueCorp, RadiusCorp, "Körperschaften (")
            }
          })
      }

      //simulation1 end




    }



    initLayout(svg1id, PerNameCenter, totalValue, Radius, "Personen (", "PerName");
    initLayout(svg2id, GeoNameCenter, totalValueGeo, RadiusGeo, "Geographika (", "GeoName")
    initLayout(svg3id, ResourcesCenter, totalValueRes, RadiusRes, "Ressourcen (", "Resources")
    initLayout(svg4id, MeetNameCenter, totalValueMeet, RadiusMeet, "Veranstaltungen (", "MeetName")
    initLayout(svg5id, UniTitleCenter, totalValueUni, RadiusUni, "Werke (", "UniTitle")
    initLayout(svg6id, CorpNameCenter, totalValueCorp, RadiusCorp, "Körperschaften (", "CorpName")




    //simulation1 start
    Simulation = d3.voronoiMapSimulation(selectionDataState.filter(function(d, i) {
        return d.show == true
      }))
      .clip(CirclingPolygon)
      .weight(function(d) {
        return d.value
      })
      .initialPosition(d3.voronoiMapInitialPositionPie().startAngle(-Math.PI * 3 / 5))
      .on("tick", function() {
        Polygons = Simulation.state().polygons;
        if (Simulation.state().ended == true) {
          drawTreemap(svg1id, Polygons)
        }
      })

    SimulationGeo = d3.voronoiMapSimulation(selectionDataStateGeo.filter(function(d, i) {
        return d.show == true
      }))
      .clip(CirclingPolygonGeo)
      .weight(function(d) {
        return d.value
      })
      .initialPosition(d3.voronoiMapInitialPositionPie().startAngle(-Math.PI * 3 / 5))
      .on("tick", function() {
        PolygonsGeo = SimulationGeo.state().polygons;
        if (SimulationGeo.state().ended == true) {
          drawTreemap(svg2id, PolygonsGeo)
        }
      })

    SimulationRes = d3.voronoiMapSimulation(selectionDataStateRes.filter(function(d, i) {
        return d.show == true
      }))
      .clip(CirclingPolygonRes)
      .weight(function(d) {
        return d.value
      })
      .initialPosition(d3.voronoiMapInitialPositionPie().startAngle(-Math.PI * 3 / 5))
      .on("tick", function() {
        PolygonsRes = SimulationRes.state().polygons;
        if (SimulationRes.state().ended == true) {
          drawTreemap(svg3id, PolygonsRes)
        }
      })

    SimulationMeet = d3.voronoiMapSimulation(selectionDataStateMeet.filter(function(d, i) {
        return d.show == true
      }))
      .clip(CirclingPolygonMeet)
      .weight(function(d) {
        return d.value
      })
      .initialPosition(d3.voronoiMapInitialPositionPie().startAngle(-Math.PI * 3 / 5))
      .on("tick", function() {
        PolygonsMeet = SimulationMeet.state().polygons;
        if (SimulationMeet.state().ended == true) {
          drawTreemap(svg4id, PolygonsMeet)
        }
      })


    SimulationUni = d3.voronoiMapSimulation(selectionDataStateUni.filter(function(d, i) {
        return d.show == true
      }))
      .clip(CirclingPolygonUni)
      .weight(function(d) {
        return d.value
      })
      .initialPosition(d3.voronoiMapInitialPositionPie().startAngle(-Math.PI * 3 / 5))
      .on("tick", function() {
        PolygonsUni = SimulationUni.state().polygons;
        if (SimulationUni.state().ended == true) {
          drawTreemap(svg5id, PolygonsUni)
        }
      })


    SimulationCorp = d3.voronoiMapSimulation(selectionDataStateCorp.filter(function(d, i) {
        return d.show == true
      }))
      .clip(CirclingPolygonCorp)
      .weight(function(d) {
        return d.value
      })
      .initialPosition(d3.voronoiMapInitialPositionPie().startAngle(-Math.PI * 3 / 5))
      .on("tick", function() {
        PolygonsCorp = SimulationCorp.state().polygons;
        if (SimulationCorp.state().ended == true) {
          drawTreemap(svg6id, PolygonsCorp)
        }
      })
    //simulation1 end



  });

  /////////////////////////////////////////////
  ///Update Data Function End

  /////////////////////////////////////////////
  ///Init Data Function Start

function initData(data, geodata, resdata, meetdata, unidata, corpdata) {
  Radius = radiusScale(totalValue)
  CirclingPolygon = computeCirclingPolygon(Radius);

  RadiusGeo = radiusScale(totalValueGeo)
  CirclingPolygonGeo = computeCirclingPolygon(RadiusGeo);

  RadiusRes = radiusScale(totalValueRes)
  CirclingPolygonRes = computeCirclingPolygon(RadiusRes);

  RadiusMeet = radiusScale(totalValueMeet)
  CirclingPolygonMeet = computeCirclingPolygon(RadiusMeet);

  RadiusUni = radiusScale(totalValueUni)
  CirclingPolygonUni = computeCirclingPolygon(RadiusUni);

  RadiusCorp = radiusScale(totalValueCorp)
  CirclingPolygonCorp = computeCirclingPolygon(RadiusCorp);


}

function computeCirclingPolygon(radius) {
  var points = 60,
    increment = _2PI / points,
    circlingPolygon = [];

  for (var a = 0, i = 0; i < points; i++, a += increment) {
    circlingPolygon.push(
      [radius * Math.cos(a), radius * Math.sin(a)]
    )
  }

  return circlingPolygon;
};

function initLayout(svgid, TreemapCenter, totalValue, Radius, title, type) {

  let svgG = d3.select(svgid)

  let drawingArea = svgG.append("g")
    .classed("drawingArea", true)
    .attr("transform", "translate(" + [marginOverview.left, marginOverview.top] + ")");

  let categoryContainer = drawingArea.append("g")
    .classed("container", true)
    .attr("transform", "translate(" + TreemapCenter + ")");

  categoryContainer.append("text")
    .classed("labelbg", true)
    .attr("transform", "translate(0," + (-Radius - 6) + ")")
    .text(title + Number(totalValue).toLocaleString() + ")")
    .append("tspan")
    .text(" ▼")
    .style("font-size", 7);


  categoryContainer.append("text")
    .classed("label", true)
    .style("cursor", "pointer")
    .on("click", function() {
      createTopList(type)
    })
    .attr("transform", "translate(0," + (-Radius - 6) + ")")
    .text(title + Number(totalValue).toLocaleString() + ")")
    .append("tspan")
    .text(" ▼")
    .style("font-size", 7)

  //    .text(title + Number(totalValue).toLocaleString()  + ")");


  categoryContainer.append("g")
    .classed('whitetreebg', true)
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", Radius + 3)
    .attr("fill", "#fafafa");

  categoryContainer.append("g")
    .classed('cells', true);



}

/////////////////////////////////////////////
///Init Data Function End

/////////////////////////////////////////////
///Update Voronoi Start

function updateTreemap(svgid, TreemapCenter, polygons, totalValue, Radius, title) {
  let container

  d3.select(svgid).select(".drawingArea")
    .transition()
    .attr("transform", "translate(" + [marginOverview.left, marginOverview.top] + ")");

  d3.select(svgid).select(".container")
    .transition()
    .attr("transform", "translate(" + TreemapCenter + ")");

  d3.select(svgid).select(".labelbg")
    .transition()
    .attr("transform", "translate(0," + (-Radius - 6) + ")")


  d3.select(svgid).select(".labelbg")
    .text(title + Number(totalValue).toLocaleString() + ")")
    .append("tspan")
    .text(" ▼")
    .style("font-size", 7);


  d3.select(svgid).select(".label")
    .transition()
    .attr("transform", "translate(0," + (-Radius - 6) + ")")


  d3.select(svgid).select(".label")
    .text(title + Number(totalValue).toLocaleString() + ")")
    .append("tspan")
    .text(" ▼")
    .style("font-size", 7);

  d3.select(svgid).select(".whitetreebg").select("circle")
    .transition()
    .attr("r", Radius + 3)


  var cells = d3.select(svgid).select(".cells")
    .selectAll(".cell")
    .data(polygons);

  cells.join("path")
    .classed("cell", true)
    .merge(cells)
    .transition()
    .attr("d", function(d) {
      return "M" + d.join(",") + "z";
    })
    .style("fill", function(d) {
      if (d.site.originalObject.data.originalData.entityName == "Sonstige") {
        return "white"
      } else {
        return colorScale(d.site.originalObject.data.originalData.entityName)
      }
    })

  d3.select(svgid).selectAll(".cell").on("mouseover", function(d, i) {
      div.select("p")
        .text(d.site.originalObject.data.originalData.entityName + ": " + d.site.originalObject.data.originalData.value)
        .style("font-weight", "bold")

      div.style("opacity", .9)

    })
    .on("mousemove", function(d, i) {

      div
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 5) + "px");
    })
    .on("mouseout", function(d) {
      d3.selectAll(".link").style("opacity", 0.2)

      div.style("opacity", 0);
    });



}

/////////////////////////////////////////////
///Update Voronoi End

/////////////////////////////////////////////
///Draw Voronoi Start

function drawTreemap(svgid, polygons) {
  let container

  var cells = d3.select(svgid).select(".cells")
    .selectAll(".cell")
    .data(polygons);

  cells.enter()
    .append("path")
    .classed("cell", true)
    .merge(cells)
    .attr("d", function(d) {
      return "M" + d.join(",") + "z";
    })
    .style("fill", function(d) {
      if (d.site.originalObject.data.originalData.entityName == "Sonstige") {
        return "white"
      } else {
        return colorScale(d.site.originalObject.data.originalData.entityName)
      }
    })
    .on("mouseover", function(d, i) {
      div.select("p")
        .text(d.site.originalObject.data.originalData.entityName + ": " + d.site.originalObject.data.originalData.value)
        .style("font-weight", "bold")

      div.style("opacity", .9)

    })
    .on("mousemove", function(d, i) {

      div
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 5) + "px");
    })
    .on("mouseout", function(d) {
      d3.selectAll(".link").style("opacity", 0.2)

      div.style("opacity", 0);
    });
}

/////////////////////////////////////////////
///Draw Voronoi End

/////////////////////////////////////////////
///Create toplist on click on label function start

function createTopList(type) {
  d3.selectAll(".toplistDiv").remove()
  d3.select("body").append("div").classed("toplistDiv", true)
  d3.select(".toplistDiv").append("input").classed("toplistsearch", true).attr("type", "text").attr("placeholder", "Liste durchsuchen")
    .on("input", function() {
      let inputThis = this.value.toLowerCase()

      d3.selectAll(".toplistentries").style("display", function(d) {
        if (d.entityName.toLowerCase().includes(inputThis)) {
          return "block"
        } else {
          return "none"
        }
      })

    })

  d3.select(".toplistDiv").append("p").attr("class", "toplistCross").text("✕").on("click", function() {
    d3.selectAll(".toplistDiv").remove()
  })

  d3.select(".toplistDiv").append("div").classed("toplisttext", true)

  d3.select(".toplisttext").selectAll(".toplistentries")
    .data(function() {
      if (type == "PerName") {
        return selectionData
      } else if (type == "GeoName") {
        return selectionDataGeo
      } else if (type == "Resources") {
        return selectionDataRes
      } else if (type == "MeetName") {
        return selectionDataMeet
      } else if (type == "UniTitle") {
        return selectionDataStateUni
      } else if (type == "CorpName") {
        return selectionDataCorp
      }


    })
    .join("p")
    .classed("toplistentries", true)
    .text(function(d) {
      return d.entityName + " (" + d.value + ")"
    })

}


/////////////////////////////////////////////
///Create toplist on click on label function ende

/////////////////////////////////////////////
///Make timeline responsive start

d3.select(window).on('resize', resizeTimeline)

function resizeTimeline() {
  windowWidth = window.innerWidth - 2 * margin
  windowHeight = window.innerHeight - 2 * margin
  timelineHeight = 0.25 * windowHeight


  timelineScale = d3.scaleLinear()
    .domain(timelineInterval)
    .range([0, windowWidth]);


  d3.selectAll(".timelineRect")
    .attr("height", timelineHeight)
    .attr("width", timelineScale(timelineInterval[0] + 50) - timelineScale(timelineInterval[0])) //breite für 50 Jahre
    .attr("x", function(d) {
      return timelineScale(d)
    })

  d3.selectAll(".axisRectangles").selectAll("text")
    .attr("x", function(d) {
      return timelineScale(d)
    })
  //timelineYScale

  if (mode == "overview") {

    timelineYScale = d3.scaleLinear()
      .domain([0, 13000000])
      .range([timelineHeight, 0])


    areaGND = d3.area()
      .x(function(d, i) {
        return timelineScale(d.year);
      })
      .y0(function(d) {
        return timelineYScale(0)
      })
      .y1(function(d) {
        return timelineYScale(d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .curve(d3.curveBasis);

    areaKPE = d3.area()
      .x(function(d, i) {
        return timelineScale(d.year);
      })
      .y0(function(d) {
        return timelineYScale(d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .y1(function(d) {
        return timelineYScale(d.ResPer_KPE + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .curve(d3.curveBasis);

    areaDNB = d3.area()
      .x(function(d, i) {
        return timelineScale(d.year);
      })
      .y0(function(d) {
        return timelineYScale(d.ResPer_KPE + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .y1(function(d) {
        return timelineYScale(d.ResPer_DNB + d.ResPer_KPE + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .curve(d3.curveBasis);

    areaSBB = d3.area()
      .x(function(d, i) {
        return timelineScale(d.year);
      })
      .y0(function(d) {
        return timelineYScale(d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .y1(function(d) {
        return timelineYScale(d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .curve(d3.curveBasis);


    areaZDB = d3.area()
      .x(function(d, i) {
        return timelineScale(d.year);
      })
      .y0(function(d) {
        return timelineYScale(d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .y1(function(d) {
        return timelineYScale(d.ResPer_ZDB + d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .curve(d3.curveBasis);

    areaComp = d3.area()
      .x(function(d, i) {
        return timelineScale(d.year);
      })
      .y0(function(d) {
        return timelineYScale(d.ResPer_ZDB + d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .y1(function(d) {
        return timelineYScale(d.PerPer_Comp + d.CorpPer_Comp + d.ResPer_ZDB + d.ResPer_SBB + d.ResPer_KPE + d.ResPer_DNB + d.PerPer_GND + d.CorpPer_GND + d.GeoPer_GND + d.MeetPer_GND + d.UniPer_GND)
      })
      .curve(d3.curveBasis);

    d3.select(".overviewareaGND")
      .attr("d", areaGND)

    d3.select(".overviewareaKPE")
      .attr("d", areaKPE)

    d3.select(".overviewareaSBB")
      .attr("d", areaSBB)

    d3.select(".overviewareaDNB")
      .attr("d", areaDNB)

    d3.select(".overviewareaZDB")
      .attr("d", areaZDB)

    d3.select(".overviewareaComp")
      .attr("d", areaComp)

  } else if (mode == "graph") {

    timelineYScale = d3.scaleLinear()
      .domain([0, timelineMaxCount + 20])
      .range([timelineHeight, 0])

    brushTimelineX = d3.brushX()
      .extent([
        [0, 0],
        [windowWidth, timelineHeight]
      ]).on("brush", timelinebrushed)
      .on("end", timelinebrushed)

    if (brushStart != null && brushEnd != null) {
      d3.select(".timelinebrush").call(brushTimelineX.move, [timelineScale(brushStart), timelineScale(brushEnd)])
    }
    d3.select(".timelinebrush").call(brushTimelineX)



    areaGraphRelationAll = d3.area()
      .x(function(d, i) {
        return timelineScale(d.date);
      })
      .y0(function(d) {
        return timelineYScale(0)
      })
      .y1(function(d) {
        return timelineYScale(d.countPerson)
      })
      .curve(d3.curveBasis);

    d3.selectAll(".areachartGroup").selectAll(".timelineareaAllRelations")
      .attr("d", areaGraphRelationAll)
  }


}
/////////////////////////////////////////////
///Make timeline responsive end
