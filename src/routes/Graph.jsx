import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import CytoscapeComponent from 'react-cytoscapejs'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';
import ThemePicker from '../theme/ThemePicker';
import Navbar from '../components/Navbar';

function Graph() {
    const {currentUser} = useContext(UserContext);
    const [elements, setElements] = useState([])
    const [stylesheet, setStylesheet] = useState([])
    let navigate = useNavigate();
    var idOrderMap = {};

    useEffect(() => {
        async function fetchData(){
            const response = await axios.get(`https://${currentUser.instance}/api/v1/accounts/${currentUser.id}/following`);
            //console.log(response.data);
            // const following = response.data.map((account) =>  {
            //     return {data: {id: account.id, label: account.username}}
            // })
            //setElements([...following]);

            const cytoscapeStylesheet = [];
            const following = []
            const theme = localStorage.getItem("selectedTheme");

            response.data.forEach((account) => {
            if (account && account.id && account.display_name) {
                following.push({
                    data: {
                        id: account?.id,
                        label: account.display_name,
                    },
                });
                cytoscapeStylesheet.push(
                {
                    selector: "node",
                    style: {
                    height: 80,
                    width: 80,
                    "background-fit": "cover",
                    "border-color": "#000",
                    "border-width": 3,
                    "border-opacity": 0.5,
                    },
                },
                {
                    selector: "node[label]",
                    style: {
                    label: "data(label)",
                    "font-size": "18",
                    color: theme == "dark" ? "#ffffff" : "#000000",
                    },
                },
                {
                    selector: "node.highlight",
                    style: {
                    "border-color": "#FFF",
                    "border-width": "2px",
                    },
                },
                {
                    selector: "node[label].highlight",
                    style: {
                    label: "data(label)",
                    "font-size": "24",
                    "font-weight": "bold",
                    },
                },
                {
                    selector: "#" + account.id,
                    style: {
                    "background-image": account.avatar,
                    },
                }
                );
            }
            });
            setElements([...following]);
            setStylesheet(cytoscapeStylesheet);

            var currentCircle = 5;
            var order = elements.length - 1 > currentCircle ? 5 : elements.length - 1;
            var distance = 100;
            following.forEach((element, i) => {
                idOrderMap[element.data.id] = -order;
                if (i == currentCircle + 1) {
                    distance *= 2;
                    order = elements.length - 1 - currentCircle;
                    order = order > currentCircle * 2 ? currentCircle * 2 : order;
                    currentCircle = currentCircle + currentCircle * 2;
                }
            });
        }
        fetchData();
    }, [currentUser])

    let options = {
        name: "concentric",
    
        fit: true, // whether to fit the viewport to the graph
        padding: 30, // the padding on fit
        startAngle: (3 / 2) * Math.PI, // where nodes start in radians
        sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
        clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
        equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
        minNodeSpacing: 80, // min spacing between outside of nodes (used for radius adjustment)
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
        nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
        height: undefined, // height of layout area (overrides container height)
        width: undefined, // width of layout area (overrides container width)
        spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
        concentric: function (node) {
        // returns numeric value for each node, placing higher nodes in levels towards the centre
            return idOrderMap[node.id()];
        },
        levelWidth: function (nodes) {
        // the variation of concentric values in each level
            return 2;
        },
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
        animateFilter: function (node, i) {
            return true;
        }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
        ready: undefined, // callback on layoutready
        stop: undefined, // callback on layoutstop
        transform: function (node, position) {
            return position;
        }, // transform a given node position. Useful for changing flow direction in discrete layouts
    };
    


    return (
        <div>
            <ThemePicker />
            <Navbar />
            {/* <CytoscapeComponent elements={elements} style={{ width: '100vw', height: '100vh' }} layout={layout} cy={(cy) => cy.center()}/> */}
            <CytoscapeComponent
                cy={(cy) => {
                    cy.fit();
                    cy.center();
                    // cy.pan({ x: 300, y: 300 });
                    cy.on("tap", "node", function (e) {
                    if (!cy.data("tapListenerAdded")) {
                        cy.data("tapListenerAdded", true);
                        const node = e.target;
                        navigate(`/profile/${node.id()}`);
                    }
                    });

                    cy.on("mouseout", "node", function (e) {
                        var sel = e.target;
                        cy.elements().removeClass("semitransp");
                        sel.removeClass("highlight").outgoers().removeClass("highlight");
                    });

                    cy.on("mouseover", "node", function (e) {
                    var sel = e.target;
                    cy.elements()
                    .difference(sel.outgoers())
                    .not(sel)
                    .addClass("semitransp");
                    sel.addClass("highlight").outgoers().addClass("highlight");
                });


                }}
                layout={options}
                elements={elements}
                style={{ width: "100vw", height: "100vh" }}
                stylesheet={stylesheet}
                zoomingEnabled={true}
                userZoomingEnabled={true}
                minZoom={0.1}
                maxZoom={10}
                wheelSensitivity={0.1}
            />

        </div>
    )
}

export default Graph