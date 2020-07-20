const svg = d3.select("svg");
const margin = {top: 50, bottom: 20,left: 50,right: 20};
const width = +(svg.attr("width"));
const height = +(svg.attr("height"));
const inner_height = height - margin.bottom - margin.top;
const inner_width = width - margin.left - margin.right;
const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('width', inner_width)
    .attr('height', inner_height);
let circles;
let lines;
let x,y;
let color;

d3.json("/data/beijing.json").then(res => {
    
    const nodes = res.nodes;
    console.log(nodes)
    const edges = res.edges;
    color = d3.scaleOrdinal(d3.schemeCategory10);

    const colorScale = d3.scaleLog().base(2).domain(d3.extent(nodes, d => d.dc)).range([0, 1])

    let circle_color = d => d3.interpolatePuOr(colorScale(d))

    x = d3.scaleLinear()
            .domain(d3.extent(nodes, d => d.x))
            .range([0, inner_width]);
    y = d3.scaleLinear()
            .domain(d3.extent(nodes, d => d.y))
            .range([inner_height, 0]);      

 
    const node_map = d3.map();
    nodes.forEach(v => {
        node_map.set(v.id, [v.x, v.y]);
    })    
    edges.forEach(v => {
        v.geometry = v.geometry.map(t => {
            return t.split(" ").filter(q => q !== "").map(r => parseFloat(r));
        }).filter(v => v.length !== 0)
        v.geometry.unshift(node_map.get(v.id[0]));
        v.geometry.push(node_map.get(v.id[1]));
    })

    const line = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1]))

    const append_line = d3.line()
        .x(d => d[0])
        .y(d => d[1])
    let drag_line;

    lines = g.selectAll(".road")
    .data(edges)
    .join("path")
    .attr("class", "road")
    .attr("stroke", "gray")
    .attr("stroke-width", 3)
    .attr("fill", "none")
    .attr("d", d => line(d.geometry))
    const drag = () => {
        let start_x,start_y;
        let drag_points = [];
        function drag_start (d) {
            start_x = +d3.select(this).attr("cx");
            start_y = +d3.select(this).attr("cy");
            drag_points.push([start_x, start_y])
        }

        function dragged (d) {
            const circle = d3.select(this);
            if(start_x===0&&start_y===0){
                circle
                .attr("cx", d3.event.x)
                .attr("cy", d3.event.y);
                drag_points.push([d3.event.x, d3.event.y]);
            }else{
                circle
                .attr("cx", d3.event.x + start_x + 120)
                .attr("cy", d3.event.y + start_y - 37);
                drag_points.push([d3.event.x + start_x + 120, d3.event.y + start_y - 37]);
            }

        }

        function drag_end (d) {
            console.log(drag_points)
            drag_line = g.append("path")
                .datum(drag_points)
                .attr("class", "drag-line")
                .attr("stroke", "gray")
                .attr("stroke-width", 3)
                .attr("fill", "none")
                .attr("d", append_line)
            drag_points = [];
        }

        return d3.drag()
            .on("start", drag_start)
            .on("drag", dragged)
            .on("end", drag_end)
    };
    const brush = () => {
        
        function bursh_start (d) {
            
        }

        function brushed (d) {
            console.log(d3.event.selection)
        }
        
        function bursh_end (d) {
            
        }

        return d3.brush()
            .filter(() => d3.event.ctrlKey)
            .extent([[0, 0],[inner_width, inner_height]])
            .on("start", bursh_start)
            .on("brush", brushed)
            .on("end", bursh_end)
    }
    g.call(brush()).call(g => g.select(".overlay").style("cursor", "default"));
    circles = g.selectAll("cross")
        .data(nodes)
        .join("circle")
        .attr("class", "cross")
        .attr("cx",d => x(d.x))
        .attr("cy",d => y(d.y))
        .attr("r", 2)
        // .attr("fill", d => circle_color(d.dc))
        .attr("fill", "rgb(155, 221, 255)")
        .call(drag())
    g.call(d3.zoom()
    .extent([[0, 0], [inner_width, inner_height]])
    .scaleExtent([1, 8]))
    // .on("zoom", zoomed))
    // function zoomed() {
    //     const {transform} = d3.event;
    //     g.attr("transform", transform)
    // }



    const disticts_data = [];
    const disticts_line = {}

    const backColor = document.getElementById("back-color");
    backColor.addEventListener("change", function() {
        console.log(this.checked);
        if (this.checked) {
            d3.json("/data/北京市.json").then(results => {
                for(let result of results.features){
                
                }
                results.features.forEach((v,i) => {
                    let coordinates= v.geometry.coordinates[0];
                    disticts_data.push(coordinates)
                    let name = v.properties.name
                    let code = v.properties.adcode
                    let dis_lines = g.selectAll(".district" + code)
                    .data(coordinates)
                    .join("path")
                    .attr("class", "district"+ code)
                    .attr("class", "district")
                    .attr("stroke", "#999")
                    .attr("storke-width", 5)
                    .attr("fill", color(i))
                    .attr("d", d => line(d))
                    .attr("opacity", 0.3)
                    disticts_line[name] = dis_lines
                })
            })
        }else {
            d3.selectAll(".district").remove()
        }
    })
    const renderColor = document.getElementById("render-color");
    renderColor.addEventListener("change", function() {
        if (this.checked) {
            circles.attr("fill", d => circle_color(d.dc))
        }else {
            circles.attr("fill", "rgb(155, 221, 255)")
        }
    })

})

