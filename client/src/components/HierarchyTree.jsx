import React, { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";

const renderCustomNode = ({ nodeDatum, toggleNode }) => (
  <g>
    <rect
      width={150}
      height={90}
      x={-75} // to center rect on node position
      y={-45}
      fill="#ffffff"
      stroke="#333"
      strokeWidth={1}
      rx={10} // rounded corners
      ry={10}
      onClick={toggleNode}
    />
    <text fill="#000" fontSize="12" fontWeight="normal" x={0} y={5} textAnchor="middle" style={{ pointerEvents: "none" }}>
      {nodeDatum.name}
    </text>
    <text fill="#000" fontSize="10" fontWeight="normal" x={0} y={18} textAnchor="middle" style={{ pointerEvents: "none" }}>
      {nodeDatum.attributes?.designation || "No Designation"}
    </text>
  </g>
);

const HierarchyTree = ({ data }) => {
  const treeContainer = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const dimensions = treeContainer?.current?.getBoundingClientRect();
    setTranslate({
      x: dimensions.width / 2,
      y: dimensions.height / 6, // tweak for vertical positioning
    });
  }, []);
  return (
    <div ref={treeContainer} id="treeWrapper" style={{ width: "100%", height: "100vh" }}>
      <Tree
        data={data}
        renderCustomNodeElement={renderCustomNode}
        orientation="vertical"
        depthFactor={200} // Default is 100, increase to add vertical space
        separation={{ siblings: 2, nonSiblings: 3 }}
        translate={translate}
      />
    </div>
  );
};

export default HierarchyTree;
