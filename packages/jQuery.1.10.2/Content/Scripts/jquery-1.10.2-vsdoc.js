/* NUGET: BEGIN LICENSE TEXT
 *
 * Microsoft grants you the right to use these script files for the sole
 * purpose of either: (i) interacting through your browser with the Microsoft
 * website or online service, subject to the applicable licensing or use
 * terms; or (ii) using the files as included with a Microsoft product subject
 * to that product's license terms. Microsoft reserves all other rights to the
 * files not expressly granted by Microsoft, whether by implication, estoppel
 * or otherwise. Insofar as a script file is dual licensed under GPL,
 * Microsoft neither took the code under GPL nor distributes it thereunder but
 * under the terms set out in this paragraph. All notices and licenses
 * below are for informational purposes only.
 *
 * NUGET: END LICENSE TEXT */
/*
* This file has been generated to support Visual Studio IntelliSense.
* You should not use this file at runtime inside the browser--it is only
* intended to be used only for design-time IntelliSense.  Please use the
* standard jQuery library for all runtime use.
*
* Comment version: 1.10.2
*/

/*!
* jQuery JavaScript Library v1.10.2
* http://jquery.com/
*
* Includes Sizzle.js
* http://sizzlejs.com/
*
* Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
* Released under the MIT license
* http://jquery.org/license
*
*/

(function ( window, undefined ) {
var jQuery = function( selector, context ) {
/// <summary>
///     1: Accepts a string containing a CSS selector which is then used to match a set of elements.
///     &#10;    1.1 - $(selector, context) 
///     &#10;    1.2 - $(element) 
///     &#10;    1.3 - $(object) 
///     &#10;    1.4 - $(elementArray) 
///     &#10;    1.5 - $(jQuery object) 
///     &#10;    1.6 - $()
///     &#10;2: Creates DOM elements on the fly from the provided string of raw HTML.
///     &#10;    2.1 - $(html, ownerDocument) 
///     &#10;    2.2 - $(html, props)
///     &#10;3: Binds a function to be executed when the DOM has finished loading.
///     &#10;    3.1 - $(callback)
/// </summary>
/// <param name="selector" type="String">
///     A string containing a selector expression
/// </param>
/// <param name="context" type="jQuery">
///     A DOM Element, Document, or jQuery to use as context
/// </param>
/// <returns type="jQuery" />

		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	};
jQuery.Animation = function Animation( elem, properties, options ) {

	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
};
jQuery.Callbacks = function( options ) {
/// <summary>
///     A multi-purpose callbacks list object that provides a powerful way to manage callback lists.
/// </summary>
/// <param name="options" type="String">
///     An optional list of space-separated flags that change how the callback list behaves.
/// </param>


	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.Deferred = function( func ) {

		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	};
jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};
jQuery.Tween = function Tween( elem, options, prop, end, easing ) {

	return new Tween.prototype.init( elem, options, prop, end, easing );
};
jQuery._data = function( elem, name, data ) {

		return internalData( elem, name, data, true );
	};
jQuery._evalUrl = function( url ) {

		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	};
jQuery._queueHooks = function( elem, type ) {

		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	};
jQuery._removeData = function( elem, name ) {

		return internalRemoveData( elem, name, true );
	};
jQuery.acceptData = function( elem ) {

		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	};
jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {

		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	};
jQuery.active = 0;
jQuery.ajax = function( url, options ) {
/// <summary>
///     Perform an asynchronous HTTP (Ajax) request.
///     &#10;1 - jQuery.ajax(url, settings) 
///     &#10;2 - jQuery.ajax(settings)
/// </summary>
/// <param name="url" type="String">
///     A string containing the URL to which the request is sent.
/// </param>
/// <param name="options" type="Object">
///     A set of key/value pairs that configure the Ajax request. All settings are optional. A default can be set for any option with $.ajaxSetup(). See jQuery.ajax( settings ) below for a complete list of all settings.
/// </param>


		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	};
jQuery.ajaxPrefilter = function( dataTypeExpression, func ) {
/// <summary>
///     Handle custom Ajax options or modify existing options before each request is sent and before they are processed by $.ajax().
/// </summary>
/// <param name="dataTypeExpression" type="String">
///     An optional string containing one or more space-separated dataTypes
/// </param>
/// <param name="func" type="Function">
///     A handler to set default values for future Ajax requests.
/// </param>
/// <returns type="undefined" />


		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
jQuery.ajaxSettings = { "url": 'http://jqueryvsdocgen.azurewebsites.net/?ver=1.10.2&newLineMethod=xml',
"type": 'GET',
"isLocal": false,
"global": true,
"processData": true,
"async": true,
"contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
"accepts": {},
"contents": {},
"responseFields": {},
"converters": {},
"flatOptions": {},
"jsonp": 'callback' };
jQuery.ajaxSetup = function( target, settings ) {
/// <summary>
///     Set default values for future Ajax requests.
/// </summary>
/// <param name="target" type="Object">
///     A set of key/value pairs that configure the default Ajax request. All options are optional.
/// </param>

		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	};
jQuery.ajaxTransport = function( dataTypeExpression, func ) {


		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
jQuery.attr = function( elem, name, value ) {

		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	};
jQuery.attrHooks = { "type": {} };
jQuery.buildFragment = function( elems, context, scripts, selection ) {

		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	};
jQuery.cache = {};
jQuery.camelCase = function( string ) {

		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	};
jQuery.cleanData = function( elems, /* internal */ acceptData ) {

		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	};
jQuery.clone = function( elem, dataAndEvents, deepDataAndEvents ) {

		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	};
jQuery.contains = function( context, elem ) {
/// <summary>
///     Check to see if a DOM element is within another DOM element.
/// </summary>
/// <param name="context" domElement="true">
///     The DOM element that may contain the other element.
/// </param>
/// <param name="elem" domElement="true">
///     The DOM element that may be contained by the other element.
/// </param>
/// <returns type="Boolean" />

	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};
jQuery.css = function( elem, name, extra, styles ) {

		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	};
jQuery.cssHooks = { "opacity": {},
"height": {},
"width": {},
"margin": {},
"padding": {},
"borderWidth": {} };
jQuery.cssNumber = { "columnCount": true,
"fillOpacity": true,
"fontWeight": true,
"lineHeight": true,
"opacity": true,
"orphans": true,
"widows": true,
"zIndex": true,
"zoom": true };
jQuery.cssProps = { "float": 'cssFloat',
"display": 'display',
"visibility": 'visibility' };
jQuery.data = function( elem, name, data ) {
/// <summary>
///     1: Store arbitrary data associated with the specified element. Returns the value that was set.
///     &#10;    1.1 - jQuery.data(element, key, value)
///     &#10;2: Returns value at named data store for the element, as set by jQuery.data(element, name, value), or the full data store for the element.
///     &#10;    2.1 - jQuery.data(element, key) 
///     &#10;    2.2 - jQuery.data(element)
/// </summary>
/// <param name="elem" domElement="true">
///     The DOM element to associate with the data.
/// </param>
/// <param name="name" type="String">
///     A string naming the piece of data to set.
/// </param>
/// <param name="data" type="Object">
///     The new data value.
/// </param>
/// <returns type="Object" />

		return internalData( elem, name, data );
	};
jQuery.dequeue = function( elem, type ) {
/// <summary>
///     Execute the next function on the queue for the matched element.
/// </summary>
/// <param name="elem" domElement="true">
///     A DOM element from which to remove and execute a queued function.
/// </param>
/// <param name="type" type="String">
///     A string containing the name of the queue. Defaults to fx, the standard effects queue.
/// </param>
/// <returns type="undefined" />

		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	};
jQuery.dir = function( elem, dir, until ) {

		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	};
jQuery.each = function( obj, callback, args ) {
/// <summary>
///     A generic iterator function, which can be used to seamlessly iterate over both objects and arrays. Arrays and array-like objects with a length property (such as a function's arguments object) are iterated by numeric index, from 0 to length-1. Other objects are iterated via their named properties.
/// </summary>
/// <param name="obj" type="Object">
///     The object or array to iterate over.
/// </param>
/// <param name="callback" type="Function">
///     The function that will be executed on every object.
/// </param>
/// <returns type="Object" />

		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	};
jQuery.easing = {};
jQuery.error = function( msg ) {
/// <summary>
///     Takes a string and throws an exception containing it.
/// </summary>
/// <param name="msg" type="String">
///     The message to send out.
/// </param>

		throw new Error( msg );
	};
jQuery.etag = {};
jQuery.event = { "global": {},
"props": ['altKey','bubbles','cancelable','ctrlKey','currentTarget','eventPhase','metaKey','relatedTarget','shiftKey','target','timeStamp','view','which'],
"fixHooks": {},
"keyHooks": {},
"mouseHooks": {},
"special": {},
"triggered": {} };
jQuery.expr = { "cacheLength": 50,
"match": {},
"attrHandle": {},
"find": {},
"relative": {},
"preFilter": {},
"filter": {},
"pseudos": {},
"filters": {},
"setFilters": {},
":": {} };
jQuery.extend = function() {
/// <summary>
///     Merge the contents of two or more objects together into the first object.
///     &#10;1 - jQuery.extend(target, object1, objectN) 
///     &#10;2 - jQuery.extend(deep, target, object1, objectN)
/// </summary>
/// <param name="" type="Boolean">
///     If true, the merge becomes recursive (aka. deep copy).
/// </param>
/// <param name="" type="Object">
///     The object to extend. It will receive the new properties.
/// </param>
/// <param name="" type="Object">
///     An object containing additional properties to merge in.
/// </param>
/// <param name="" type="Object">
///     Additional objects containing properties to merge in.
/// </param>
/// <returns type="Object" />

	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};
jQuery.filter = function( expr, elems, not ) {

		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	};
jQuery.find = function Sizzle( selector, context, results, seed ) {

	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
};
jQuery.fn = { "jquery": '1.10.2',
"selector": '',
"length": 0 };
jQuery.fx = function( elem, options, prop, end, easing, unit ) {

		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	};
jQuery.get = function( url, data, callback, type ) {
/// <summary>
///     Load data from the server using a HTTP GET request.
/// </summary>
/// <param name="url" type="String">
///     A string containing the URL to which the request is sent.
/// </param>
/// <param name="data" type="String">
///     A map or string that is sent to the server with the request.
/// </param>
/// <param name="callback" type="Function">
///     A callback function that is executed if the request succeeds.
/// </param>
/// <param name="type" type="String">
///     The type of data expected from the server. Default: Intelligent Guess (xml, json, script, or html).
/// </param>

		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
jQuery.getJSON = function( url, data, callback ) {
/// <summary>
///     Load JSON-encoded data from the server using a GET HTTP request.
/// </summary>
/// <param name="url" type="String">
///     A string containing the URL to which the request is sent.
/// </param>
/// <param name="data" type="Object">
///     A map or string that is sent to the server with the request.
/// </param>
/// <param name="callback" type="Function">
///     A callback function that is executed if the request succeeds.
/// </param>

		return jQuery.get( url, data, callback, "json" );
	};
jQuery.getScript = function( url, callback ) {
/// <summary>
///     Load a JavaScript file from the server using a GET HTTP request, then execute it.
/// </summary>
/// <param name="url" type="String">
///     A string containing the URL to which the request is sent.
/// </param>
/// <param name="callback" type="Function">
///     A callback function that is executed if the request succeeds.
/// </param>

		return jQuery.get( url, undefined, callback, "script" );
	};
jQuery.globalEval = function( data ) {
/// <summary>
///     Execute some JavaScript code globally.
/// </summary>
/// <param name="data" type="String">
///     The JavaScript code to execute.
/// </param>

		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	};
jQuery.grep = function( elems, callback, inv ) {
/// <summary>
///     Finds the elements of an array which satisfy a filter function. The original array is not affected.
/// </summary>
/// <param name="elems" type="Array">
///     The array to search through.
/// </param>
/// <param name="callback" type="Function">
///     The function to process each item against.  The first argument to the function is the item, and the second argument is the index.  The function should return a Boolean value.  this will be the global window object.
/// </param>
/// <param name="inv" type="Boolean">
///     If "invert" is false, or not provided, then the function returns an array consisting of all elements for which "callback" returns true.  If "invert" is true, then the function returns an array consisting of all elements for which "callback" returns false.
/// </param>
/// <returns type="Array" />

		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	};
jQuery.guid = 1;
jQuery.hasData = function( elem ) {
/// <summary>
///     Determine whether an element has any jQuery data associated with it.
/// </summary>
/// <param name="elem" domElement="true">
///     A DOM element to be checked for data.
/// </param>
/// <returns type="Boolean" />

		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	};
jQuery.holdReady = function( hold ) {
/// <summary>
///     Holds or releases the execution of jQuery's ready event.
/// </summary>
/// <param name="hold" type="Boolean">
///     Indicates whether the ready hold is being requested or released
/// </param>
/// <returns type="undefined" />

		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	};
jQuery.inArray = function( elem, arr, i ) {
/// <summary>
///     Search for a specified value within an array and return its index (or -1 if not found).
/// </summary>
/// <param name="elem" type="Object">
///     The value to search for.
/// </param>
/// <param name="arr" type="Array">
///     An array through which to search.
/// </param>
/// <param name="i" type="Number">
///     The index of the array at which to begin the search. The default is 0, which will search the whole array.
/// </param>
/// <returns type="Number" />

		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	};
jQuery.isEmptyObject = function( obj ) {
/// <summary>
///     Check to see if an object is empty (contains no properties).
/// </summary>
/// <param name="obj" type="Object">
///     The object that will be checked to see if it's empty.
/// </param>
/// <returns type="Boolean" />

		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	};
jQuery.isFunction = function( obj ) {
/// <summary>
///     Determine if the argument passed is a Javascript function object.
/// </summary>
/// <param name="obj" type="Object">
///     Object to test whether or not it is a function.
/// </param>
/// <returns type="boolean" />

		return jQuery.type(obj) === "function";
	};
jQuery.isNumeric = function( obj ) {
/// <summary>
///     Determines whether its argument is a number.
/// </summary>
/// <param name="obj" type="Object">
///     The value to be tested.
/// </param>
/// <returns type="Boolean" />

		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	};
jQuery.isPlainObject = function( obj ) {
/// <summary>
///     Check to see if an object is a plain object (created using "{}" or "new Object").
/// </summary>
/// <param name="obj" type="Object">
///     The object that will be checked to see if it's a plain object.
/// </param>
/// <returns type="Boolean" />

		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	};
jQuery.isReady = true;
jQuery.isWindow = function( obj ) {
/// <summary>
///     Determine whether the argument is a window.
/// </summary>
/// <param name="obj" type="Object">
///     Object to test whether or not it is a window.
/// </param>
/// <returns type="boolean" />

		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	};
jQuery.isXMLDoc = function( elem ) {
/// <summary>
///     Check to see if a DOM node is within an XML document (or is an XML document).
/// </summary>
/// <param name="elem" domElement="true">
///     The DOM node that will be checked to see if it's in an XML document.
/// </param>
/// <returns type="Boolean" />

	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};
jQuery.lastModified = {};
jQuery.makeArray = function( arr, results ) {
/// <summary>
///     Convert an array-like object into a true JavaScript array.
/// </summary>
/// <param name="arr" type="Object">
///     Any object to turn into a native Array.
/// </param>
/// <returns type="Array" />

		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	};
jQuery.map = function( elems, callback, arg ) {
/// <summary>
///     Translate all items in an array or object to new array of items.
///     &#10;1 - jQuery.map(array, callback(elementOfArray, indexInArray)) 
///     &#10;2 - jQuery.map(arrayOrObject, callback( value, indexOrKey ))
/// </summary>
/// <param name="elems" type="Array">
///     The Array to translate.
/// </param>
/// <param name="callback" type="Function">
///     The function to process each item against.  The first argument to the function is the array item, the second argument is the index in array The function can return any value. Within the function, this refers to the global (window) object.
/// </param>
/// <returns type="Array" />

		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	};
jQuery.merge = function( first, second ) {
/// <summary>
///     Merge the contents of two arrays together into the first array.
/// </summary>
/// <param name="first" type="Array">
///     The first array to merge, the elements of second added.
/// </param>
/// <param name="second" type="Array">
///     The second array to merge into the first, unaltered.
/// </param>
/// <returns type="Array" />

		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	};
jQuery.noConflict = function( deep ) {
/// <summary>
///     Relinquish jQuery's control of the $ variable.
/// </summary>
/// <param name="deep" type="Boolean">
///     A Boolean indicating whether to remove all jQuery variables from the global scope (including jQuery itself).
/// </param>
/// <returns type="Object" />

		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};
jQuery.noData = { "applet": true,
"embed": true,
"object": 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' };
jQuery.nodeName = function( elem, name ) {

		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	};
jQuery.noop = function() {
/// <summary>
///     An empty function.
/// </summary>
/// <returns type="Function" />
};
jQuery.now = function() {
/// <summary>
///     Return a number representing the current time.
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a serialized representation of an array or object, suitable for use .
/// </summary>
/// <returns type="Number" />

		return ( new Date() ).getTime();
	};
jQuery.offset = {};
jQuery.param = function( a, traditional ) {
/// <summary>
///     Create a seria