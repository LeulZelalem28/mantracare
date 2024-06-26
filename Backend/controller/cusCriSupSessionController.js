const CusCriSupSession = require('../model/CusCriSupSession');
const { v4: uuidv4 } = require('uuid');

class CusCriSupSessionController {
    constructor (db) {
        this.db = db;
        this.lastAssignedIndex = -1; 
    }

    async getSupport (req, res) {
        try{
            const userId = req.body.userId;

            const cusCriSupEmpCollection = await this.db.getDB().collection('customerandcrisissupports');
            const cusCriSupSessionCollection = await this.db.getDB().collection('customerandcrisissupportsessions');

            const cusCriSupEmp = await cusCriSupEmpCollection.findOne({ _userId: userId });

            if(!cusCriSupEmp) return res.status(404).json({ message: 'The customer and crisis support employee could not be found'});

            const cusCriSupSessions = await cusCriSupSessionCollection.find({ _customerSupportId: cusCriSupEmp._customerSupportId }, { 
                projection: {
                    _id: 0,
                    sessionId: "$_sessionId", 
                    customerSupportId: "$_customerSupportId", 
                    customerSupportEmpName: "$_customerSupportEmpName", 
                    userId: "$_userId", 
                    supportType: "$_supportType", 
                    supportTimeStamp: "$_supportTimeStamp",
                }
            }).toArray()

            if (!cusCriSupSessions.length) return res.status(204).json({ 'message': 'No Customer and Crisis Support Sessions could be found' });
            res.json(cusCriSupSessions);
        } catch(error) {
            res.status(500).json({ message: 'Failed to fetch customer and crisis support sessions' });
        }    
    }

    async getSupportByUserId (req, res) {
        try{
            const userId = req.body.userId;

        const cusCriSupSessionCollection = await this.db.getDB().collection('customerandcrisissupportsessions');

        const cusCriSupSessions = await cusCriSupSessionCollection.find({ _userId: userId }, { 
            projection: {
                _id: 0,
                sessionId: "$_sessionId", 
                customerSupportId: "$_customerSupportId", 
                customerSupportEmpName: "$_customerSupportEmpName", 
                userId: "$_userId", 
                supportType: "$_supportType", 
                supportTimeStamp: "$_supportTimeStamp",
            }
        }).toArray()

        if (!cusCriSupSessions.length) return res.status(204).json({ 'message': 'No Customer and Crisis Support Sessions could be found' });
        res.json(cusCriSupSessions);
        } catch(error) {
            res.status(500).json({ message: 'Failed to fetch customer and crisis support sessions' });
        }
    }

    async getSupportById (req, res) {
        try{
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }

            const cusCriSupSessionCollection = await this.db.getDB().collection('customerandcrisissupportsessions');

            const cusCriSupSession = await cusCriSupSessionCollection.findOne({ _sessionId: req.params.id }, { 
                projection: {
                    _id: 0,
                    sessionId: "$_sessionId", 
                    customerSupportId: "$_customerSupportId", 
                    customerSupportEmpName: "$_customerSupportEmpName", 
                    userId: "$_userId", 
                    supportType: "$_supportType", 
                    supportTimeStamp: "$_supportTimeStamp",
                }
            });

        if (!cusCriSupSession) return res.status(404).json({ message: 'No Customer and Crisis Support Session could be found' });
        res.json(cusCriSupSession);

        } catch(error) {
            res.status(500).json({ message: 'Failed to fetch customer and crisis support sessions' });
        }
    }

    getSupportBySessionType = async (req, res) => {
        try {
            const { supportType } = req.params;
            if (!supportType) {
                return res.status(400).json({ message: 'Support type parameter is required' });
            }
    
            const cusCriSupSessionCollection = await this.db.getDB().collection('customerandcrisissupportsessions');
            const supportSessions = await cusCriSupSessionCollection.find({ _supportType: supportType }, {
                projection: {
                    _id: 0,
                    sessionId: "$_sessionId", 
                    customerSupportId: "$_customerSupportId", 
                    customerSupportEmpName: "$_customerSupportEmpName", 
                    userId: "$_userId", 
                    supportType: "$_supportType", 
                    supportTimeStamp: "$_supportTimeStamp",
                },
            }).toArray();
    
            if (!supportSessions.length) {
                return res.status(404).json({ message: `No support sessions found for type ${supportType}` });
            }
    
            res.json(supportSessions);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch support sessions' });
            console.log(error);
        }
    };
    

    async createSupport (req, res) {
        try{
            const cusCriSupSessData = req.body;
            const supportType = req.params.supportType

            const cusCriSupEmpCollection = await this.db.getDB().collection('customerandcrisissupports');
            const cusCriSupSessionCollection = await this.db.getDB().collection('customerandcrisissupportsessions');

            if(!cusCriSupSessData.userId || !supportType) {
                return res.status(400).json({ message: 'Missing required fields! '});
            }

            if(supportType != 'Crisis' && supportType != 'Customer') {
                return res.status(400).json({ message: 'The Session type is not invalid'});
            }

            const cusCriSupEmps = await cusCriSupEmpCollection.find({}).toArray();

            if (cusCriSupEmps.length === 0) {
                return res.status(500).json({ message: 'No customer and crisis support employees found' });
            }

            // Round-robin mechanism
            this.lastAssignedIndex = (this.lastAssignedIndex + 1) % cusCriSupEmps.length;
            const selectedEmp = cusCriSupEmps[this.lastAssignedIndex];

            const cusCriSupSession = new CusCriSupSession();

            cusCriSupSession.sessionId = uuidv4();
            cusCriSupSession.customerSupportId = selectedEmp._customerSupportId;
            cusCriSupSession.customerSupportEmpName = selectedEmp._name;
            cusCriSupSession.userId = cusCriSupSessData.userId;
            cusCriSupSession.supportType = supportType;
            cusCriSupSession.supportTimeStamp = new Date();

            await cusCriSupSessionCollection.insertOne(cusCriSupSession);

            res.status(201).json({ 'message': ' customer and crisis support session created successfully', 'customerCrisisSupportSession': cusCriSupSession });

        } catch(error) {
            res.status(500).json({ message: 'Failed to Create customer and crisis support session' });
        }

    }

    async deleteSupport (req, res) {
        try{
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            
            const cusCriSupSessionCollection = await this.db.getDB().collection('customerandcrisissupportsessions');

            const existingSession = await cusCriSupSessionCollection.findOne({ _sessionId: req.params.id });

            if(!existingSession) {
                return res.status(404).json({ message: 'Session not found'});
            }

            await cusCriSupSessionCollection.deleteOne({ _sessionId: req.params.id });

            res.json({ message: 'Customer and crisis support session deleted successfully' });

        } catch(error) {
            res.status(500).json({ message: 'Failed to delete customer and crisis support session' });
        }

    }
}

module.exports = CusCriSupSessionController;