const Resource = require('../model/Resource');
const { v4: uuidv4 } = require('uuid');

class ResourceController {

    constructor (db) {
        this.db = db;
    }

    getResources = async (req, res) => {
        try{
            let { page = 1, limit = 10 } = req.query; 
    
            const resourceCollection = await this.db.getDB().collection('resources');
            page = parseInt(page);
            limit = parseInt(limit)
    
            const startIndex = (page - 1) * limit;
    
            const resources = await resourceCollection.find({}, {
                projection: {
                    _id: 0,
                    resourceId: "$_resourceId",
                    resourceTitle: "$_resourceTitle",
                    resourceDescription: "$_resourceDescription",
                    resourceCreatorId: "$_resourceCreatorId",
                    resourceAuthor: "$_resourceAuthor",
                    // resourceContent: "$_resourceContent",
                    resourceTimeStamp: "$_resourceTimeStamp",
                    likes: "$_likes",
                    comments: "$_comments"
                }
            }).sort({ _resourceTimeStamp: -1 }).skip(startIndex).limit(limit).toArray();
    
            const totalCount = await resourceCollection.countDocuments();
    
            if (!resources.length) return res.status(204).json({ message: 'No resources found' });
    
            res.json({ resources, totalCount });
    
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch resources' });
            
        }
    }
    
    getResourceById = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            const resourceCollection = await this.db.getDB().collection('resources');
    
            const resource = await resourceCollection.findOne({ _resourceId: req.params.id }, {
                projection: {
                    _id: 0,
                    resourceId: "$_resourceId",
                    resourceTitle: "$_resourceTitle",
                    resourceDescription: "$_resourceDescription",
                    resourceCreatorId: "$_resourceCreatorId",
                    resourceAuthor: "$_resourceAuthor",
                    resourceContent: "$_resourceContent",
                    resourceTimeStamp: "$_resourceTimeStamp",
                    likes: "$_likes",
                    likesBy: "$_likesBy",
                    comments: "$_comments"
                }
            });
    
            // If resource not found
            if (!resource) return res.status(204).json({ message: 'No resource found' });
    
            // Fetch details of users who commented
            const userIds = resource.comments.map(comment => comment.commentedBy);
            const usersCollection = await this.db.getDB().collection('users');
            const users = await usersCollection.find({ _id: { $in: userIds } }).toArray();
    
            // Map user details to comments
            resource.comments.forEach(comment => {
                const user = users.find(user => user._id === comment.commentedBy);
                if (user) {
                    comment.commentedBy = user.username; // Assuming 'username' is the field containing user's name
                }
            });
    
            res.json(resource);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch resource' });
        }    
    }
    

    getResourceByTitleORAuthor = async (req, res) => {
        try {
            let { search  } = req.query;
    
            const resourceCollection = await this.db.getDB().collection('resources');
           
    
            
    
            // Search query
            const searchQuery = {
                $or: [
                    { _resourceTitle: { $regex: `.*${search}.*`, $options: 'i' } },
                    { _resourceAuthor: { $regex: `.*${search}.*`, $options: 'i' } }
                ]
            };
            
  

            const resources = await resourceCollection.find(searchQuery, {
                projection: {
                    _id: 0,
                    resourceId: "$_resourceId",
                    resourceTitle: "$_resourceTitle",
                    resourceDescription: "$_resourceDescription",
                    resourceCreatorId: "$_resourceCreatorId",
                    resourceAuthor: "$_resourceAuthor",
                    resourceTimeStamp: "$_resourceTimeStamp",
                    likes: "$_likes",
                    comments: "$_comments"
                }
            }).sort({ _resourceTimeStamp: -1 }).toArray();
    
            const totalCount = await resourceCollection.countDocuments(searchQuery);
            console.log('hi',resources)
            if (!resources.length) return res.status(204).json({ message: 'No resources found' });
            
            res.json({ resources, totalCount });
            
    
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch resources' });
            console.log(error)
        }
    }
    
    getResourceByTherapistId = async (req, res) => {
        try {
            let { page = 1, limit = 10 } = req.query; 
    
            page = parseInt(page);
            limit = parseInt(limit)
    
            const startIndex = (page - 1) * limit;
            
            const therapistCollection = await this.db.getDB().collection('therapists');
            const resourceCollection = await this.db.getDB().collection('resources');
    
            // Find therapist by therapistId
            const therapist = await therapistCollection.findOne({ _userId: req.body.userId });
    
            if (!therapist) {
                return res.status(404).json({ message: 'Therapist not found' });
            }
    
            // Find resources by therapistId
            const resources = await resourceCollection.find({ _resourceCreatorId: therapist._therapistId}, {
                projection: {
                    _id: 0,
                    resourceId: "$_resourceId",
                    resourceTitle: "$_resourceTitle",
                    resourceDescription: "$_resourceDescription",
                    resourceCreatorId: "$_resourceCreatorId",
                    resourceAuthor: "$_resourceAuthor",
                    resourceTimeStamp: "$_resourceTimeStamp",
                    likes: "$_likes",
                    comments: "$_comments"
                }
            })({ _resourceTimeStamp: -1 }).skip(startIndex).limit(limit).toArray();

            const totalCount = await resourceCollection.countDocuments();
    
            if (!resources.length) {
                return res.status(204).json({ message: 'No resources found for this therapist' });
            }
            
            res.json({ resources, totalCount });
            
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch resources by therapist ID' });
        }
    }
    

    createResource  = async (req, res) => {
        try{
            const resourceData = req.body;

            const resourceCollection = await this.db.getDB().collection('resources');
            const therapistCollection = await this.db.getDB().collection('therapists');
            console.log(resourceData.resourceContent) 

            //check for missing fields
            if(!resourceData.resourceTitle || !resourceData.resourceContent) {
                console.log('hi')
                return res.status(400).json({ message: 'Missing required fields! '});
            }

            const therapist = await therapistCollection.findOne({ _userId: resourceData.userId}) ;

            if(!therapist) return res.status(400).json({ message: 'User is not a therapist'});

            const resource = new Resource();
            resource.resourceId = uuidv4()
            resource.resourceTitle = resourceData.resourceTitle;  
            resource.resourceContent = resourceData.resourceContent;
            resource.resourceCreatorId = therapist._therapistId;
            resource.resourceAuthor = therapist._name;
            resource.resourceDescription = resourceData.resourceContent.length > 60 ? resourceData.resourceContent.substring(0, 60) + '...' : resourceData.resourceDescription;
            resource.resourceTimeStamp = new Date();
            resource.likes = 0;

            await resourceCollection.insertOne(resource);
            console.log(resource)
            res.status(201).json({ message: 'resource created successfully', 'createdResource': resource });

        } catch (error) {
            res.status(500).json({ message: 'Failed to create resource'});
            console.log(error)
        }     
    }

    updateResource  = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }

            const resourceData = req.body;
            const resourceId = req.params.id;

            const resourceCollection = await this.db.getDB().collection('resources');

            const existingResource = await resourceCollection.findOne({ _resourceId: resourceId });

            if (!existingResource) {
                return res.status(404).json({ message: 'Resource not found' });
            }

            const updatedData = { 
                resourceTitle: resourceData.resourceTitle ? resourceData.resourceTitle : existingResource.resourceTitle,
                resourceContent: resourceData.resourceContent ? resourceData.resourceContent : existingResource.resourceContent,
                resourceDescription: resourceData.resourceContent ? 
                                        (resourceData.resourceContent.length > 60 ? 
                                        resourceData.resourceContent.substring(0, 60) + '...' : 
                                        resourceData.resourceData.resourceDescription ): 
                                        existingResource.resourceDescription,
            }

            const result = await resourceCollection.updateOne(
                { _resourceId: resourceId},
                { $set: {
                    _resourceTitle: updatedData.resourceTitle ,
                    _resourceContent: updatedData.resourceContent,
                    _resourceDescription: updatedData.resourceDescription
                }}
            );
            res.json({ message: 'Resource updated successfully' , updatedResource: result})
        } catch (error) {
            res.status(500).json({ message: 'Failed to update resource' });
        }
    }

    makeComment = async (req, res) => {
        try {
            const { comment } = req.body;
            const resourceId = req.params.id;
            const userId = req.body.userId; // Assuming you're using authentication middleware to get user details
    
            if (!comment || !resourceId || !userId) {
                return res.status(400).json({ message: 'Missing required fields!' });
            }
    
            const resourceCollection = await this.db.getDB().collection('resources');
            const existingResource = await resourceCollection.findOne({ _resourceId: resourceId });
            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');

            const patient = await patientCollection.findOne({_userId : userId});
            const therapist = await therapistCollection.findOne({_userId : userId});
            
    
            if (!existingResource) {
                return res.status(404).json({ message: 'Resource not found' });
            }
            console.log(patient,' df', therapist)

            const commentBy = patient ? patient._username : therapist._username
    
            // Save the comment wyith the ID of the user who commented
            await resourceCollection.updateOne(
                { _resourceId: resourceId },
                { $push: { _comments: { comment, commentedBy: commentBy } } }
            );
    
            res.status(200).json({ message: 'Comment added successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to add comment' });
            console.log(error)
        }
    }
    
    

    giveALike = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ message: 'Resource ID is required' });
            }
    
            const userId = req.body.userId;
    
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
    
            const db = this.db.getDB();
            const resourceCollection = db.collection('resources');
            const patientCollection = db.collection('patients');
            const therapistCollection = db.collection('therapists');
    
            const [existingResource, patient, therapist] = await Promise.all([
                resourceCollection.findOne({ _resourceId: req.params.id }),
                patientCollection.findOne({ _userId: userId }),
                therapistCollection.findOne({ _userId: userId })
            ]);
    
            if (!existingResource) {
                return res.status(404).json({ message: 'Resource not found' });
            }
    
            const username = patient ? patient._username : therapist ? therapist._username : null;
    
            if (!username) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            
            if (!Array.isArray(existingResource._likesBy)) {
                existingResource._likesBy = [];
            }
    
            let likeStatus;
    
            // Check if user has already liked the resource
            if (existingResource._likesBy.includes(username)) {
                // Unlike the resource
                await resourceCollection.updateOne(
                    { _resourceId: req.params.id },
                    {
                        $inc: { _likes: -1 },
                        $pull: { _likesBy: username }
                    }
                );
                likeStatus = 'unliked';
            } else {
                // Like the resource
              await resourceCollection.updateOne(
                    { _resourceId: req.params.id },
                    {
                        $inc: { _likes: 1 },
                        $push: { _likesBy: username }
                    }
                );
                likeStatus = 'liked';
               
            }
    
            res.status(200).json({ message: `${likeStatus} successfully`, likeStatus });
        } catch (error) {
            res.status(500).json({ message: 'Failed to toggle like' });
            console.error(error);
        }
    };
    
    
    
    
    deleteResource =  async (req, res) => {
      try {
        if (!req?.params?.id) {
            return res.status(400).json({ message: 'Resource ID is required' });
        }

        const resourceCollection = await this.db.getDB().collection('resources');
        const existingResource = await resourceCollection.findOne({ _resourceId: req.params.id });

        if (!existingResource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        await resourceCollection.deleteOne({ _resourceId: req.params.id });
        res.json({ message: 'Resource deleted successfully'})
      } catch (error) {
        res.status(500).json({ message: 'Failed to delete message' });
      } 
    }
}

module.exports = ResourceController;