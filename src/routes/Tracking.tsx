import ScoreBG from "../assets/ScoreBG.png";
import Hole1 from "../assets/holes/1.png";
import CircularButton from "../components/CircularButton";
import React, { useState, useRef, useEffect } from "react";
import "../App.css";
import * as d3 from "d3";
// import Hole2 from "../assets/holes/2.png";
// import Hole3 from "../assets/holes/3.png";
// import Hole4 from "../assets/holes/4.png";
// import Hole5 from "../assets/holes/5.png";
// import Hole6 from "../assets/holes/6.png";
// import Hole7 from "../assets/holes/7.png";
// import Hole8 from "../assets/holes/8.png";
// import Hole9 from "../assets/holes/9.png";

const Tracking = () => {
  const [putts, setPutts] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const svgRef = useRef(null);
  const [shotHistory, setShotHistory] = useState<
    Array<{ x: string; y: string; length?: string; angle?: number }>
  >([{ x: "49.3%", y: "90.5%" }]);

  useEffect(() => {
    if (shotHistory.length < 1) return;

    const svg = d3.select(svgRef.current);
    if (!svg.node()) return; // check if the node exists to make TypeScript happy

    svg.selectAll("*").remove(); // clear previous lines and balls

    const node = svg.node() as unknown as SVGSVGElement;
    if (!node) return; // Guard clause
    const svgWidth = node.getBoundingClientRect().width;
    const svgHeight = node.getBoundingClientRect().height;

    const lineGenerator = d3
      .line<{ x: string; y: string }>()
      .x((d: { x: string }) => (parseFloat(d.x) / 100) * svgWidth)
      .y((d: { y: string }) => (parseFloat(d.y) / 100) * svgHeight);

    svg
      .append("path")
      .attr("d", lineGenerator(shotHistory) as never) // cast to any due to d3 type nuances
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("stroke-width", 6);

    svg
      .selectAll("circle")
      .data(shotHistory)
      .enter()
      .append("circle")
      .attr("cx", (d: { x: string }) => (parseFloat(d.x) / 100) * svgWidth)
      .attr("cy", (d: { y: string }) => (parseFloat(d.y) / 100) * svgHeight)
      .attr(
        "r",
        (
          _d: { x: string; y: string; length?: string; angle?: number },
          i: number
        ) =>
          shotHistory.length === 1 || i !== shotHistory.length - 1 ? 7.5 : 10
      ) // adjust radius based on the shot order
      .attr(
        "fill",
        (
          _d: { x: string; y: string; length?: string; angle?: number },
          i: number
        ) => (i === shotHistory.length - 1 ? "white" : "black")
      );

    svg
      .selectAll("text")
      .data(shotHistory)
      .enter()
      .append("text")
      .attr("x", (d: { x: string }) => (parseFloat(d.x) / 100) * svgWidth)
      .attr("y", (d: { y: string }) => {
        const yPos = (parseFloat(d.y) / 100) * svgHeight;
        return yPos < 20 ? yPos + 25 : yPos - 15; // assuming 20 as a buffer value
      })

      .text(
        (
          _d: { x: string; y: string; length?: string; angle?: number },
          i: number
        ) => (i !== 0 ? i.toString() : "")
      )
      .attr("fill", "white")
      .attr("font-size", "16px")
      .attr("text-anchor", "middle")
      .attr("font-family", "Archivo")
      .attr("font-weight", "bold");
  }, [shotHistory]);

  const incrementPutts = () => {
    setPutts((prevPutts) => prevPutts + 1);
    setScore((prevScore) => prevScore + 1);
  };

  const decrementPutts = () => {
    setPutts((prevPutts) => prevPutts - 1);
    setScore((prevScore) => prevScore - 1);
  };

  const undoShot = () => {
    setShotHistory((prevHistory) => prevHistory.slice(0, -1));
    setScore((prevScore) => prevScore - 1);
  };

  const submitScore = () => {
    console.log("Score submitted!");
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    console.log("X:", e.clientX - rect.left, "Y:", e.clientY - rect.top);

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setScore((prevScore) => prevScore + 1);
      setShotHistory((prevHistory) => [
        ...prevHistory,
        { x: xPercent + "%", y: yPercent + "%" },
      ]);
    }
  };

  return (
    <div
      className="flex h-full w-full justify-center items-center flex-col"
      style={{
        backgroundImage: `url(${ScoreBG})`,
        backgroundSize: "cover",
      }}
    >
      <div className="flex w-full mt-2 justify-evenly absolute top-0">
        <div className="flex flex-col items-center">
          <h1 className="font-archivo font-medium italic text-green-700 opacity-75">
            HOLE
          </h1>
          <div
            className="p-2 px-4 border-4 border-green-700 rounded-xl bg-white items-center justify-center"
            style={{
              boxShadow: "5px 5px #2d603a",
            }}
          >
            <h1 className="font-archivo font-black text-green-700 text-4xl">
              #1
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="font-archivo font-medium italic text-green-700 opacity-75">
            SCORE
          </h1>
          <div
            className="px-4 border-4 border-green-700 rounded-xl bg-white items-center justify-center"
            style={{
              boxShadow: "5px 5px #2d603a",
            }}
          >
            <h1 className="font-archivo font-black text-green-700 text-8xl">
              {score}
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="font-archivo font-medium italic text-green-700 opacity-75">
            TOTAL
          </h1>
          <div
            className="p-2 px-4 border-4 border-green-700 rounded-xl bg-white items-center justify-center"
            style={{
              boxShadow: "5px 5px #2d603a",
            }}
          >
            <h1 className="font-archivo font-black text-green-700 text-4xl">
              21
            </h1>
          </div>
        </div>
      </div>
      <div
        className="flex w-full h-96 mt-8 justify-between items-center"
        onClick={handleTap}
        style={{
          position: "relative",
          backgroundImage: `url(${Hole1})`,
          backgroundSize: "30%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
        }}
      >
        <svg
          ref={svgRef}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        ></svg>
      </div>
      <div className="flex w-full h-1/6 mb-8 justify-between items-end px-4 absolute bottom-0 overflow-visible">
        <div className="grid grid-cols-3 h-16 gap-6 w-4/6">
          <CircularButton icon="minus" onClick={decrementPutts} />
          <div className="flex flex-col items-center">
            <div
              className="p-2 px-4 border-4 border-green-700 rounded-xl bg-white items-center justify-center"
              style={{
                boxShadow: "5px 5px #2d603a",
              }}
            >
              <h1 className="font-archivo font-black text-green-700 text-4xl">
                {putts}
              </h1>
            </div>
            <h1 className="pt-1 font-archivo font-medium italic text-green-700 opacity-75">
              PUTTS
            </h1>
          </div>
          <CircularButton icon="plus" onClick={incrementPutts} />
        </div>
        <div className="grid grid-rows-2 grid-cols-1 h-36 items-end">
          {shotHistory.length > 1 ? (
            <CircularButton icon="arrow" onClick={undoShot} />
          ) : (
            <div className="h-16 w-16"></div>
          )}
          <CircularButton icon="check" onClick={submitScore} />
        </div>
      </div>
    </div>
  );
};

export default Tracking;
