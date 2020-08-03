const D3 = d3 || {};
var svg = D3.selectAll('.main')
  .append('svg')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('class', 'main__inner-text--bottom')
  .append('g');

var arc = D3.arc()
  .innerRadius(280)
  .outerRadius(310)
  .startAngle(0.87 * Math.PI)
  .endAngle(1.13 * Math.PI);

svg
  .append('path')
  .attr('class', 'arc')
  .attr('id', 'identity-arc')
  .attr('d', arc)
  .attr('transform', 'translate(300,300)');

svg
  .append('text')
  .attr('dy', function (d, i) {
    return 20; //10
  })
  .attr('dx', function (d, i) {
    return 20; //20
  })
  .append('textPath')
  .attr('startOffset', '71%')
  .style('text-anchor', 'middle')
  .attr('xlink:href', '#identity-arc')
  .text('Ephesians 2:10');

window.onload = () => {
  const titles = document.querySelectorAll('.header__title');
  for (let i = 0, len = titles.length; i < len; i += 1) {
    titles[i].addEventListener('click', function (e) {
      const container = this.parentNode;
      const expandedClass = 'expanded';
      if (container.classList.contains(expandedClass)) {
        container.classList.remove(expandedClass);
      } else {
        container.classList.add(expandedClass);
      }
    });
  }
};
