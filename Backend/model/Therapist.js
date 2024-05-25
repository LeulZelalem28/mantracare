const User = require('./User');

class Therapist extends User {
    constructor(therapistId, address, specialization, experience, education, description){
        super();
        this._therapistId = therapistId;
        this._role = 'Therapist'
        this._address = address;
        this._specialization = specialization;
        this._experience = experience;
        this._education = education;
        this._description = description;
        this._approved = false;

    }

    get therapistId() {
        return this._therapistId;
    }

    set therapistId(therapistId) {
        this._therapistId = therapistId;
    }

    get role() {
        return this._role;
    }

    get address() {
        return this._address;
    }

    set address(address) {
        this._address = address;
    }

    get specialization() {
        return this._specialization; 
    }

    set specialization(specialization) {
        this._specialization = specialization;   
    }

    get experience () {
        return this._experience
    }

    set experience(experience) {
        this._experience = experience;    
    }

    get education () {
        return this._education;
    }

    set education(education) {
        this._education = education; 
    }

    get description() {
        return this._description;
    }

    set description(description) {
        this._description = description;
    }


    get approved() {
        return this._approved;
    }

    set approved(approved) {
        this._approved = approved;
    }
    
}

module.exports = Therapist;