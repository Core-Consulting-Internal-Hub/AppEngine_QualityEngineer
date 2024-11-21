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
import { DataTable, TableColumn, TimeframeV2 } from "@dynatrace/strato-components-preview";
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import { serviceTagsQueryResult } from "../Data/QueryResult";
import { MatchTagsWithTags } from "../components/MatchTags";
import { subHours, subDays } from "date-fns"

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
const generateNodes = (data: SequenceData[], onClick: (service: SequenceData) => void, links: Record<string, string[]>): Node[] => {
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
        <div style={{ textAlign: "center", color: Colors.Text.Primary.Default }} onClick={() => onClick(service)}>
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
  const [time, setTime] = useState<TimeframeV2 | null>({
    from: {
      absoluteDate: subDays(new Date(), 30).toISOString(),
      value: 'now()-30d',
      type: 'expression',
    },
    to: {
      absoluteDate: new Date().toISOString(),
      value: 'now()',
      type: 'expression',
    },
  });
  const location = useLocation();
  const { services, cycle, run } = location.state || {};
  const [state, setState] = useState(true);
  const [sequences, setSequences] = useState<SequenceData[]>(
    () =>
      services?.map((item, index) => ({
        id: (index + 1).toString(),
        serviceName: item.name,
        href: item.link,
        metrics: {
          responseTime: "100ms",
          throughput: "100rps",
        },
      })) || []
  );

  const [links, setLinks] = useState<Record<string, string[]>>({});
  const [tempInputValues, setTempInputValues] = useState<string>(""); // Raw input string
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedService, setSelectedService] = useState<SequenceData | null>(
    null
  );

  const transactionQueryResult = useDqlQuery({
    body: {
      query: 
      selectedService
        ? 
        `
        timeseries meantime = avg(jmeter.usermetrics.transaction.meantime),from: "${time?.from.absoluteDate}", to: "${time?.to.absoluteDate}", by: { transaction, cycle, run }
      | fieldsAdd arrayAvg(meantime)
      | summarize by:{cycle, run, transaction}, meantime = avg(arrayAvg(meantime))
        `
        : "", // No query when no service is selected
    },
  });

  const serviceQueryResult = useDqlQuery({
    body:{
      query:
      selectedService
        ? 
        `
        fetch dt.entity.service, from: "${time?.from.absoluteDate}", to: "${time?.to.absoluteDate}"
          | fieldsRename service = entity.name
          | filter service == "${selectedService.serviceName}"
          | fieldsAdd tags
          | filter isNotNull(tags)
          | expand tags
        `
        : "", // No query when no service is selected
    },
  })

  const parseComplexInput = (input: string): Record<string, string[]> => {
    const links: Record<string, string[]> = {};
  
    // Helper to add a link to the links map
    const addLink = (from: string, to: string) => {
      if (!links[from]) {
        links[from] = [];
      }
      if (!links[from].includes(to)) {
        links[from].push(to);
      }
    };
  
    // Recursive function to process a single line of the input
    const processLine = (nodes: string[]) => {
      for (let i = 0; i < nodes.length - 1; i++) {
        const current = nodes[i].trim();
        const nextPart = nodes[i + 1].trim();
  
        // Handle branching (e.g., 2,3)
        const nextNodes = nextPart.split(",").map((n) => n.trim());
  
        nextNodes.forEach((nextNode) => {
          addLink(current, nextNode);
        });
      }
    };
  
    // Process each line of input
    input.split("\n").forEach((line) => {
      const nodes = line.split("->").map((n) => n.trim());
      if (nodes.length > 1) {
        processLine(nodes);
      }
    });
  
    return links;
  };

  const columns: TableColumn[] = [
    {
      header: "Transaction",
      accessor: "transaction",
      autoWidth: true,
    },
    {
      header: "Meantime",
      accessor: "meantime",
      autoWidth: true,
    },
  ];
  
  // Match transactions with processed tags
  const getMatchedTransactions = () => {
    if (!transactionQueryResult.data || !serviceQueryResult.data) return ["This is empty"];

    const transactions = transactionQueryResult.data.records;
    const services = serviceQueryResult.data.records;

    // Process service tags: remove "Transaction:" prefix
    const processedTags = services.map((service) => ({
      ...service,
      cleanedTag: service?.tags?.toString().replace("Transaction:", "").toLowerCase(),
    }));

    // Match transactions by comparing with cleaned tags
    return transactions.filter((transaction) =>
      processedTags.some(
        (service) =>
          service.cleanedTag && 
          service.cleanedTag === transaction?.transaction?.toString().toLowerCase()
      )
    );
  };

  const matchedTransactions = getMatchedTransactions();

  // On save, update the `links` state with the parsed input
  const handleSaveClick = () => {
    const parsedLinks = parseComplexInput(tempInputValues);
    setLinks(parsedLinks); // Update the links state
    setState(false); // Close the modal
  };

  const handleServiceClick = (service: SequenceData) => {
    setSelectedService(service);
  };

  useEffect(() => {
    setNodes(generateNodes(sequences, handleServiceClick, links));
    setEdges(generateEdges(links));
  }, [links]);

  return (
    <>
      <Modal title={"Sequence"} show={state} onDismiss={() => setState(false)}>
        <div style={{ padding: "20px" }}>
          {sequences.map((item) => (
            <Flex flexDirection="row" key={item.id}>
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
          <Button onClick={handleSaveClick}>Save</Button> 
        </div>
      </Modal>

      <div
        style={{
          width: "100%",
          height: "60vh",
          background: Colors.Background.Surface.Default,
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          style={{ background: Colors.Background.Surface.Default }}
          // elementsSelectable={true}
          // nodesDraggable={true}
          // panOnDrag={true}
        >
          <Background color={Colors.Border.Neutral.Default} gap={16} />
          <Controls />
        </ReactFlow>
      </div>
      
      <div>
        {/* {transactionQueryResult.data ? (
          <pre>{JSON.stringify(transactionQueryResult.data.records, null, 2)}</pre>
        ) : (
          <Text>No trans</Text>
        )}
        <br></br>

        {serviceQueryResult.data ? (
          <pre>{JSON.stringify(serviceQueryResult.data.records, null, 2)}</pre>
        ) : (
          <Text>No service</Text>
        )} 
        {matchedTransactions ? (
          <pre>{JSON.stringify(matchedTransactions, null, 2)}</pre>
        ) : (
          <Text>No such transaction</Text>
        )} */}
        {selectedService != null ? (
          <>
            <h1>You have selected: {selectedService.serviceName}</h1>
            {transactionQueryResult.data ? (
              <DataTable
                data={matchedTransactions}
                columns={columns}
              />
            ) : (
              <Text>Loading or no data...</Text>
            )}
          </>
        ) : (
          <h1>Please select a service to view details.</h1>
        )}
      </div>
    </>
  );
};

