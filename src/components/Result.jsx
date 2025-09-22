const Result = ({ result }) => {
    if (!result) return null;

    if (typeof result === "string" || typeof result === "number") {
        return <h2 id="result">{result}</h2>;
    }

    if (typeof result === "object") {
        return (
            <div id="result">
                {result.rodResult && <h2>Pręt: {result.rodResult}</h2>}
                {result.pipeResult && <h2>Rura: {result.pipeResult}</h2>}
            </div>
        );
    }

    return null;
};

export default Result;
