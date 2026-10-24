const Tables = require("../../Modal/Tables");

const GetTables = async (req, res) => {
    try {
        const tableInfo = await Tables.find();
        res.status(200).json({ 
            success: true, 
            status: true, 
            table: tableInfo 
        });
    } catch (error) {
        console.error("Error fetching tables:", error.message);
        res.status(500).json({ 
            success: false, 
            status: false, 
            message: "Internal server error occurred" 
        });
    }
}

const TableInsert = async (req, res) => {
    try {
        const { name, seats } = req.body;
        if (!name || !seats) {
            return res.status(400).json({ success: false, status: false, message: "Name and seats are required" });
        }

        const existingTable = await Tables.findOne({ name });
        if (existingTable) {
            return res.status(400).json({ success: false, status: false, message: "Table already exists" });
        }

        const TableInfo = new Tables({ name, seats });
        const TableSaveInfo = await TableInfo.save();
        res.status(201).json({ 
            success: true, 
            status: true, 
            table: TableSaveInfo, 
            message: "Table added successfully" 
        });
    } catch (error) {
        console.error("Error inserting table:", error.message);
        res.status(500).json({ 
            success: false, 
            status: false, 
            message: "Internal server error occurred" 
        });
    }
}

const TableUpdate =  async (req,res)=>{
    try{
        const { name, seats } = req.body;
        const newTable = {};
        if (name) { newTable.name = name };
        if (seats) { newTable.seats = seats };
        let newData = await Tables.findById(req.params.id);
        if (!newData) {
            return res.status(404).send("Table Not Found");
        }
        newData = await Tables.findByIdAndUpdate(req.params.id,{
        $set: newTable }, { new: true })
        // res.json({ newData});

        res.status(200).json({ table: newData, status: true });

    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Some Error ouccured");
    }
}



const DeleteTable =  async (req, res)=> {
    try{
        let tableInfo = await Tables.findById(req.params.id);
        console.log(tableInfo,'tableInfo');
        if (!tableInfo) {
            return res.status(404).send("Table Not Found");
        }
        tableInfo = await Tables.findByIdAndDelete(req.params.id)
        res.status(200).json({ table: tableInfo, status: true});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Some Error ouccured");
    }
}

module.exports={GetTables,TableInsert,TableUpdate,DeleteTable};