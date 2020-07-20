import networkx as nx
import osmnx as ox
import json

data = {}
ox.config(use_cache=True, log_console=False)
# G = ox.graph_from_place('Piedmont, California, USA', network_type='drive')
G = ox.graph_from_place('北京, 中国', network_type='drive')
adj = G.adj
links = list()
vertex = list()
edges = G.edges

for edge in edges:
    current_edge = edges[edge]
    links.append({
        'id': edge,
        'osmid': current_edge.get('osmid'),
        'geometry': str(current_edge.get('geometry'))[12:-1].split(","),
        'length': current_edge.get('length')
    })
    # id geometry
nodes = G.nodes
for node in nodes:
    current_node = nodes[node]
    vertex.append({
        'id': node,
        'osmid': current_node.get('osmid'),
        'x': current_node.get('x'),
        'y': current_node.get('y')
    })

data['nodes'] = vertex
data['edges'] = links

with open('data.json', 'w') as fp:
    json.dump(data, fp)