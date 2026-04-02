import React from 'react';

export default function MatrixCanvas({ frame, onCellClick, color }) {
  return (
    <table className="table-matrix" style={{borderCollapse:'collapse',margin:'0 auto',boxShadow:'0 1px 7px #0005'}}>
      <tbody>
        {frame.map((row, r) => (
          <tr key={r}>
            {row.map((col, c) => (
              <td key={c} 
                  tabIndex={0}
                  style={{width:18, height:18, background:col, border:'1px solid #222', cursor:'pointer'}}
                  onClick={()=>onCellClick(r,c)}
                  title={`(${r},${c})`}
                />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}// 支持自定义颜色与单元格点击