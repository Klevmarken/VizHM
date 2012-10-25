#
# Splunk UI module python renderer
# This module is imported by the module loader (lib.module.ModuleMapper) into
# the splunk.appserver.mrsparkle.controllers.module.* namespace.
#

import json
import logging
import os
import sys

import cherrypy
import controllers.module as module
import splunk
import splunk.search
import math
import splunk.util
import time
import lib.util as util
from splunk.appserver.mrsparkle.lib import jsonresponse

logger = logging.getLogger('splunk.appserver.controller.module.SplunkVizHM')

class SplunkVizHM(module.ModuleHandler):
    
    def generateResults(self, host_app, client_app, sid, count=1000, offset=0, entity_name='results'):

        count = max(int(count), 0)
        offset = max(int(offset), 0)
        if not sid:
            raise Exception('SplunkVizHM.generateResults - sid not passed!')
        try:
            job = splunk.search.getJob(sid)
            dataset = getattr(job, entity_name)[offset: offset+count]
            output = self.parse_dataset(dataset)
            logger.info('output %s' % output)
            json = self.render_json(output)
            output = "{\"my data\": \"is here\"}"
            return json
                           
        except splunk.ResourceNotFound, e:
            logger.error('SplunkVizHM could not find job %s.' % sid)
            return _('<p class="resultStatusMessage">Could not retrieve search data.</p>')

	
        
    def parse_dataset(self, dataset):    
  	jsonObj = []
			
	for i, result in enumerate(dataset):
		tdict = {}
				
		for key in result.keys():
			logger.info('keys %s' %key)
			logger.info('value %s' %result.get(key))
		
		tdict['name'] = str(result.get('processor'))
		tdict['key'] = str(result.get('unixtime'))
		tdict['time'] = str(result.get('time'))
		tdict['value'] = str(result.get('cumulative_hits')) 
		
		CH = str(result.get('cumulative_hits'))
		logger.info('cumulative_hits %s' %CH)
		
		Processor = str(result.get('processor'))
		logger.info('processor %s' % Processor)
		
		time = str(result.get('time'))
		logger.info('time %s' % time)
		
		jsonObj.append(tdict)
	         
        return jsonObj 

    def render_json(self, response_data, set_mime='text/json'):
        cherrypy.response.headers['Content-Type'] = set_mime
            
        if isinstance(response_data, jsonresponse.JsonResponse):
       	    response = response_data.toJson().replace("</", "<\\/")
        else:
            response = json.dumps(response_data).replace("</", "<\\/")
                                                    
        # Pad with 256 bytes of whitespace for IE security issue. See SPL-34355
        return ' ' * 256  + '\n' + response
        
 
