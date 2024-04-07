import React,{useState,useEffect} from 'react'

const AllFiles = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);


    // Fetch all files
    const fetchFiles = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/files");
            const data = await res.json();
            setFiles(data);
            setLoading(false);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchFiles();
    }, []);

  return (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {files.map(file => (
                <div key={file._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                    <img src={`http://localhost:8000/api/files/download/${file.uuid}`} alt={file.filename} className="w-full h-64 object-cover" />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">{file.filename}</h3>
                        <p className="text-gray-600">{file.size} bytes</p>
                    </div>
                </div>
            ))}
        </div>
    </>
  )
}

export default AllFiles