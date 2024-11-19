import { Colors } from "@dynatrace/strato-design-tokens";
import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  Position,
  Node,
  Edge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { Modal } from "@dynatrace/strato-components-preview/overlays";
import { Text, Button, Flex } from "@dynatrace/strato-components";
import { useLocation } from "react-router-dom";

// Type for SequenceData
type SequenceData = {
  id: string; // Changed to string for key-based mapping
  serviceName: string;
  href: string;
  metrics: {
    responseTime: string;
    throughput: string;
  };
};

// Function to generate nodes with positions
const generateNodes = (data: SequenceData[], links: Record<string, string[]>): Node[] => {
  const ySpacing = 150;
  const xSpacing = 300;

  const positions = new Map<string, { x: number; y: number }>();
  const levelNodeCounts = new Map<number, number>();

  const assignPositions = (id: string, x: number) => {
    if (!positions.has(id)) {
      const currentLevelCount = levelNodeCounts.get(x) || 0;
      const y = currentLevelCount * ySpacing;
      positions.set(id, { x, y });
      levelNodeCounts.set(x, currentLevelCount + 1);

      const nextKeys = links[id] || [];
      nextKeys.forEach((nextId) => {
        assignPositions(nextId, x + xSpacing);
      });
    }
  };

  // Assign positions starting from root nodes
  Object.keys(links).forEach((key) => assignPositions(key, 0));

  return data.map((service) => ({
    id: service.id,
    data: {
      label: (
        <div style={{ textAlign: "center", color: Colors.Text.Primary.Default }}>
          <strong style={{ fontSize: "20px" }}>{service.serviceName}</strong>
          <br />
          <span>Response Time: {service.metrics.responseTime}</span>
          <br />
          <span>Throughput: {service.metrics.throughput}</span>
        </div>
      ),
    },
    position: positions.get(service.id) || { x: 0, y: 0 },
    style: {
      width: 220,
      height: 120,
      background: Colors.Background.Surface.Default,
      border: "1px solid #bbb",
      borderRadius: 10,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  }));
};

// Function to generate edges
const generateEdges = (links: Record<string, string[]>): Edge[] => {
  const edges: Edge[] = [];

  Object.entries(links).forEach(([source, targets]) => {
    targets.forEach((target) => {
      edges.push({
        id: `${source}-${target}`,
        source,
        target,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color: "white",
        },
        style: {
          stroke: "white",
          strokeWidth: 2,
        },
      });
    });
  });

  return edges;
};

export const ServiceFlowCard = () => {
  const location = useLocation();
  const {services} = location.state || {};
  const [state, setState] = useState(true);
  const [sequences, setSequences] = useState<SequenceData[]>(() =>
    services?.map((item, index) => ({
      id: (index + 1).toString(), // Use index as a string for the ID
      serviceName: item.name,
      href: item.link,
      metrics: {
        responseTime: "100ms", // Default metric value; you can modify this
        throughput: "100rps", // Default metric value; you can modify this
      },
    })) || []
  );
  
  const [links, setLinks] = useState<Record<string, string[]>>({});
  const [tempInputValues, setTempInputValues] = useState<string>(""); // Raw input string
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Parse input string and update links
  const parseInput = () => {
    const newLinks: Record<string, string[]> = {};
    const lines = tempInputValues.split("\n");

    lines.forEach((line) => {
      const [key, targets] = line.split("->");
      if (key && targets) {
        newLinks[key.trim()] = targets.split(",").map((t) => t.trim());
      }
    });

    setLinks(newLinks);
    setState(false); // Close the modal
  };

  // Update nodes and edges whenever links change
  useEffect(() => {
    setNodes(generateNodes(sequences, links));
    setEdges(generateEdges(links));
  }, [links]);

  return (
    <>
      <Modal title={"Sequence"} show={state} onDismiss={() => setState(false)}>
        <div style={{ padding: "20px" }}>
          {sequences.map((item) => (
            <Flex flexDirection="row">
              <Text>ID: {item.id}</Text>
              <Text>Service Name: {item.serviceName}</Text>
            </Flex>
          ))}
          <Text>Define the sequence in the format: key{"->"}key1,key2</Text>
          <textarea
            value={tempInputValues}
            onChange={(e) => setTempInputValues(e.target.value)}
            rows={6}
            style={{
              width: "100%",
              marginTop: "10px",
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
            placeholder={"1->2,3\n2->3"}
          />
          <Button onClick={parseInput}>Save</Button>
        </div>
      </Modal>

      <div style={{ width: "100%", height: "100vh", background: Colors.Background.Surface.Default }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          style={{ background: Colors.Background.Surface.Default }}
        >
          <Background color={Colors.Border.Neutral.Default} gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
};
