import { Colors } from "@dynatrace/strato-design-tokens";
import React, { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Position,
  addEdge,
  Node,
  Edge,
  Connection,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

// Sample Data
type SequenceData = {
  id: number;
  serviceName: string;
  href: string;
  next?: number[]; // IDs of the next services
  metrics: {
    responseTime: string;
    throughput: string;
  };
};

const sampleData: SequenceData[] = [
  {
    id: 1,
    serviceName: "Service A",
    href: "/a",
    next: [2, 3],
    metrics: { responseTime: "200ms", throughput: "50rps" },
  },
  {
    id: 2,
    serviceName: "Service B",
    href: "/b",
    next: [4, 6],
    metrics: { responseTime: "150ms", throughput: "80rps" },
  },
  {
    id: 3,
    serviceName: "Service C",
    href: "/c",
    next: [5],
    metrics: { responseTime: "300ms", throughput: "30rps" },
  },
  {
    id: 4,
    serviceName: "Service D",
    href: "/d",
    metrics: { responseTime: "100ms", throughput: "120rps" },
  },
  {
    id: 5,
    serviceName: "Service E",
    href: "/d",
    metrics: { responseTime: "100ms", throughput: "120rps" },
  },
  {
    id: 6,
    serviceName: "Service F",
    href: "/d",
    metrics: { responseTime: "100ms", throughput: "120rps" },
  },
];

// Function to generate nodes with detailed labels
const generateNodes = (data: SequenceData[]): Node[] => {
  const ySpacing = 150; // Vertical spacing between nodes
  const xSpacing = 300; // Horizontal spacing between levels

  // Map to track how many nodes exist at each `x` position
  const levelNodeCounts = new Map<number, number>();

  const positions = new Map<number, { x: number; y: number }>();

  const assignPositions = (id: number, x: number) => {
    if (!positions.has(id)) {
      // Determine the `y` position for the current level
      const currentLevelCount = levelNodeCounts.get(x) || 0;
      const y = currentLevelCount * ySpacing;

      // Update position map and level count
      positions.set(id, { x, y });
      levelNodeCounts.set(x, currentLevelCount + 1);

      // Recursively assign positions for connected nodes
      const service = data.find((s) => s.id === id);
      if (service?.next) {
        service.next.forEach((nextId) => {
          assignPositions(nextId, x + xSpacing);
        });
      }
    }
  };

  // Start positioning from the first service
  assignPositions(1, 0);

  // Convert `positions` map to nodes
  return data.map((service) => ({
    id: service.id.toString(),
    data: {
      label: (
        <div style={{ textAlign: "center", color: Colors.Text.Primary.Default }}>
          <strong style={{fontSize:"20px"}}>{service.serviceName}</strong>
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
const generateEdges = (data: SequenceData[]): Edge[] =>
  data.flatMap((service) =>
    service.next?.map((nextId) => ({
      id: `${service.id}-${nextId}`,
      source: service.id.toString(),
      target: nextId.toString(),
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
    })) || []
  );

const ServiceFlowCard = () => {
  // Generate nodes and edges
  const [nodes, setNodes] = useState<Node[]>(generateNodes(sampleData));
  const [edges, setEdges] = useState<Edge[]>(generateEdges(sampleData));

  // Handlers for adding edges and managing changes
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  return (
    <div style={{ width: "100%", height: "100vh", background: Colors.Background.Surface.Default }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        // onConnect={onConnect}
        style={{ background: Colors.Background.Surface.Default }} // Background color
        nodesConnectable={false} // Disable connecting nodes manually
      >
        <Background color={Colors.Border.Neutral.Default} gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default ServiceFlowCard;
