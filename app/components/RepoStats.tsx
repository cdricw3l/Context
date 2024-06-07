import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface RepoStatsProps {
  commits: number;
  contributors: { login: string; contributions: number }[];
  stars: number;
  forks: number;
}

const RepoStats: React.FC<RepoStatsProps> = ({ commits, contributors, stars, forks }) => {
  const barChartRef = useRef<SVGSVGElement>(null);
  const pieChartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Bar Chart for contributors
    const svg = d3.select(barChartRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(contributors.map(d => d.login))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(contributors, d => d.contributions) as number])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = (g: any) =>
      g.attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    const yAxis = (g: any) =>
      g.attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    svg.append('g')
      .attr('fill', 'steelblue')
      .selectAll('rect')
      .data(contributors)
      .enter().append('rect')
        .attr('x', d => x(d.login) as number)
        .attr('y', d => y(d.contributions))
        .attr('height', d => y(0) - y(d.contributions))
        .attr('width', x.bandwidth());

    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);

    // Pie Chart for repo stats
    const pieSvg = d3.select(pieChartRef.current);
    pieSvg.selectAll('*').remove(); // Clear previous content

    const pieData = [stars, forks, commits];
    const pieColors = d3.scaleOrdinal(['#ffcd56', '#36a2eb', '#ff6384']);

    const pie = d3.pie<number>().sort(null);
    const arc = d3.arc<d3.PieArcDatum<number>>().innerRadius(0).outerRadius(Math.min(width, height) / 2 - 1);

    const arcs = pieSvg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)
      .selectAll('path')
      .data(pie(pieData))
      .enter().append('path')
        .attr('fill', (d, i) => pieColors(i as unknown as string) as string)
        .attr('d', arc as any);
  }, [contributors, commits, stars, forks]);

  return (
    <div>
      <h2 className="text-xl font-bold">Repository Statistics</h2>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Contributors</h3>
        <svg ref={barChartRef} width="500" height="300"></svg>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Overall Repo Stats</h3>
        <svg ref={pieChartRef} width="300" height="300"></svg>
      </div>
    </div>
  );
};

export default RepoStats;
