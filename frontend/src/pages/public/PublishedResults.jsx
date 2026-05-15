import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import {
    PieChart,
    Pie,
    Tooltip,
    Cell,
    ResponsiveContainer,
} from "recharts"

import api from "../../api/axios"

const COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
    "#f97316",
]

function PublishedResults() {
    const { pollId } = useParams()

    const [results, setResults] = useState(null)

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState("")

    // Fetch published results

    const fetchResults = async () => {
        try {
            const response = await api.get(`/analytics/public/${pollId}`)

            setResults(response.data.data)
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load results"
            )
        } finally {
            setLoading(false)
        }
   } 

    useEffect(() => {
        fetchResults()
    }, [pollId])

    // Loading

    if(loading) {
        return <div>Loading results...</div>
    }

    if(error) {
        return <div>Error: {error}</div>
    }

    // No results
    if(!results) {
        return <div>No results found</div>
    }

    return (
        <div>
            <div>
            {/* Header */}
            <h1>
                 {results.title}
            </h1>

            <p>Published Poll Results </p>
            </div>

            {/* Total Responses */}
            <div>
                <h2>
                     Total Responses
                </h2>

                <p>
                    {results.totalResponses}
                </p>
            </div>

            {/* Questions */}

            <div>
                {results.questions.map((question, index) => (
                    <div key={index}>
                        <h2>
                            {question.question}
                        </h2>

                        <div>
                            {/* Option counts */}
                            <div>
                                {question.options.map((option, idx) => (
                                     <div
                          key={idx}
                          >
                            <span className="font-medium">
                            {option.option}
                          </span>

                          <span className="font-bold text-blue-600">
                            {option.count}
                          </span>
                            
                             </div>
                                ))}
                            </div>

                            {/* Pie Chart */}
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={question.options}
                                            dataKey="count"
                                            nameKey="option"
                                            outerRadius={100}
                                            label
                                            >
                                                {question.options.map((_, idx) => (
                                                    <Cell
                                                        key={idx}
                                                        fill={COLORS[idx % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    
                ))}
            </div>

            {/* Footer */}
            <div>
                 Poll Results Platform
            </div>
        </div>

    )
}

export default PublishedResults