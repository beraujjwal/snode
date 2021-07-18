'use strict';
const autoBind = require( 'auto-bind' );
const { BaseService } = require("../../system/core/services/BaseService");
var mailer =  require('../../config/mailer');
var crypto = require('crypto');
const { Response } = require("../helpers/Response");

class Services extends BaseService {



    /**
     * Service constructor
     * @author Ujjwal Bera
     * @param null
     */
    constructor( ) {
        super( );
        this.mailer = mailer;
        this.crypto = crypto;
        this.Response = new Response();
        autoBind( this );
    }


    async isUnique(model, key, value, id=null) {
      const query = [];

      value = value.toLowerCase();
      value = value.replace(/[^a-zA-Z ]/g, "");
      value = value.replace(/[^a-zA-Z]/g, "-");

      if(value) {
        query.push({
          [key]: {
            [this.Op.eq]: value
          }
        })
      }

      if(id != null) {
        query.push({
          id: {
            [this.Op.ne]: id
          }
        })
      }

      return model.findOne({
        where: {          
          [this.Op.and]: query
        }
      });
    }

}

module.exports = { Services };