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

d3.json("/data.json").then(res => {
    console.log(res);
    const nodes = res.nodes;
    const edges = res.edges;

    const x = d3.scaleLinear()
            .domain(d3.extent(nodes, d => d.x))
            .range([0, inner_width]);
    const y = d3.scaleLinear()
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

    const lines = g.selectAll(".road")
    .data(edges)
    .join("path")
    .attr("class", "road")
    .attr("stroke", "gray")
    .attr("stroke-width", 5)
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
                .attr("stroke-width", 5)
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
    const circles = g.selectAll("cross")
        .data(nodes)
        .join("circle")
        .attr("class", "cross")
        .attr("cx",d => x(d.x))
        .attr("cy",d => y(d.y))
        .attr("r", 7)
        .attr("fill", "red")
        .call(drag())
    console.log(event)
    

    const resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", () => {
        circles
            .attr("cx",d => x(d.x))
            .attr("cy",d => y(d.y));
        lines   
            .attr("d", d => line(d.geometry));

        d3.selectAll(".drag-line").remove();
    })
})
