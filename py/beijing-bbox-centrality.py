import networkx as nx
import osmnx as ox
import json

data = {}
ox.config(use_cache=True, log_console=True)

G = ox.graph_from_bbox(40.19, 39.70,116.75,116.05,network_type='drive')
stats = ox.basic_stats(G)
extended_stats = ox.extended_stats(G, ecc=True, bc=True, cc=True)
stats.update(extended_stats)
ox.save_graphml(G,"network1.gml")
nx.set_node_attributes(G,stats.get("avg_neighbor_degree"),"avg_neighbor_degree")
nx.set_node_attributes(G,stats.get("degree_centrality"),"degree_centrality")
nx.set_node_attributes(G,stats.get("pagerank"),"pagerank")
nx.set_node_attributes(G,stats.get("closeness_centrality"),"closeness_centrality")
nx.set_node_attributes(G,stats.get("betweenness_centrality"),"betweenness_centrality")
ox.save_graphml(G,"network2.gml")
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
        "betweenness_centrality": current_node.get("betweenness_centrality"),
        "avg_neighbor_degree": current_node.get("avg_neighbor_degree")
    })

data['nodes'] = vertex
data['edges'] = links

with open('data.json', 'w') as fp:
    json.dump(data, fp)