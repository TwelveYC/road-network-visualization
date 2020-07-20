import networkx as nx
import osmnx as ox
import json

data = {}
ox.config(use_cache=True, log_console=True)
G = ox.graph_from_place('Piedmont, California, USA', network_type='drive')
# G = ox.graph_from_place('beijing, china', network_type='drive', which_result=2)
# G = ox.graph_from_bbox(40.19, 39.70,116.75,116.05,network_type='drive')
print("ok")
adj = G.adj
links = list()
vertex = list()
edges = G.edges
# degree_centrality = nx.degree_centrality(G)
# nx.set_node_attributes(G, degree_centrality, "degree_centrality")
# closeness_centrality = nx.closeness_centrality(G)
# nx.set_node_attributes(G, closeness_centrality, "closeness_centrality")
# eigenvector_centrality = nx.eigenvector_centrality(G)
# nx.set_node_attributes(G, eigenvector_centrality, "eigenvector_centrality")
# betweenness_centrality = nx.betweenness_centrality(G)
# nx.set_node_attributes(G, betweenness_centrality, "betweenness_centrality")
# print("ok")


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
        'y': current_node.get('y'),
        "degree_centrality": current_node.get("degree_centrality"),
        "closeness_centrality": current_node.get("closeness_centrality"),
        "eigenvector_centrality": current_node.get("eigenvector_centrality"),
        "betweenness_centrality": current_node.get("betweenness_centrality"),
    })

data['nodes'] = vertex
data['edges'] = links

with open('data.json', 'w') as fp:
    json.dump(data, fp)