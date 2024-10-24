/* eslint-disable react/prop-types */

// lute\templates\read\termpopup.html

export default function PopupInfo({ data }) {
  return (
    <div>
      <p>
        <strong style={{ fontSize: "120%" }}>
          {data.term} {data.parentterms && `(${data.parentterms})`}
        </strong>
      </p>

      {/* {flashMsg && <p className="small-flash-notice">{flashMsg}</p>} */}

      {data.romanization && (
        <p>
          <i>{data.romanization}</i>
        </p>
      )}

      {data.term_images.map((img, index) => (
        <img key={index} className="tooltip-image" src={img} alt="" />
      ))}

      {data.translation && <p style={{ whiteSpace: "pre-wrap" }}>{data.translation}</p>}

      <p>
        {data.term_tags.map((t, index) => (
          <span key={index} className="termpopup-tag">
            {t}
          </span>
        ))}
      </p>

      {data.parentdata.length > 0 && (
        <table>
          {data.componentdata.length > 0 && (
            <thead>
              <tr>
                <td>Parents</td>
              </tr>
            </thead>
          )}
          <tbody>
            {data.parentdata.map((p, index) => (
              <tr key={index}>
                <td style={{ verticalAlign: "top" }}>
                  <strong>{p.term}</strong>
                  {p.roman && (
                    <>
                      <br />
                      <i>({p.roman})</i>
                    </>
                  )}
                </td>
                <td style={{ verticalAlign: "top" }}>
                  <span style={{ whiteSpace: "pre-wrap" }}>{p.trans}</span>
                  <p>
                    {p.tags.map((tag, idx) => (
                      <span key={idx} className="termpopup-tag">
                        {tag}
                      </span>
                    ))}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {data.componentdata.length > 0 && (
        <table>
          {data.parentdata.length > 0 && (
            <thead>
              <tr>
                <td>Components</td>
              </tr>
            </thead>
          )}
          <tbody>
            {data.componentdata.map((p, index) => (
              <tr key={index}>
                <td style={{ verticalAlign: "top" }}>
                  <strong>{p.term}</strong>
                  {p.roman && (
                    <>
                      <br />
                      <i>({p.roman})</i>
                    </>
                  )}
                </td>
                <td style={{ verticalAlign: "top" }}>
                  <span style={{ whiteSpace: "pre-wrap" }}>{p.trans}</span>
                  <p>
                    {p.tags.map((tag, idx) => (
                      <span key={idx} className="termpopup-tag">
                        {tag}
                      </span>
                    ))}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
