/**
 *  By Kayhan Dehghani: http://www.kayhandehghani.com/ 
 * 	May 15 2018 
 */

Module.register("MMM-dshop-news", {
	defaults: {
		isLoading: false,
		contentIndex: 0,
		lastAction: ""
	},

	start() {
		Log.log(this.name + " is started!");
		// this.configJSON = this.sendSocketNotification("GET_API_CONFIG", {path: this.file("/files/private_config.json")});
	},

	loaded(callback) {
		Log.log(this.name + " is loaded!");
		callback();
	},

	getDom() {
		var content = document.createElement("div");

        if(this.config.isLoading) {
			content = this.createSpinner();
		} 
		
		content = this.createStaticContent();
		return content;
	},

	notificationReceived(notification, payload, sender) {
		if (notification === "SENSOR_SWIPED") {
			if (payload.action === "right") {
				this.config.lastAction = "right";
				this.config.contentIndex++;
				if (this.config.contentIndex > 4) {
					this.config.contentIndex = 0; 
				}
			} else if (payload.action === "left") {
				this.config.lastAction = "left";
				this.config.contentIndex--;
				if (this.config.contentIndex < 0) {
					this.config.contentIndex = 2; 
				}
			}
			this.updateDom();
		}
	},

	createSpinner() {
		var spinner = document.createElement("div");
		spinner.setAttribute("class", "spinner");
		return spinner;
	},

	getStyles() {
		return [this.file("/css/main.css")];
	},

	getNews(url, key) {
		// this.sendSocketNotification("GET_NEWS", {url: url, key: key});
		
		// simulate API delay
		setTimeout(() => {
			this.config.isLoading = false;
			this.updateDom();
		}, 3000);
	},

	socketNotificationReceived(notification, payload) {
		if (notification === "API_CONFIG_FETCHED") {
			this.getNews(payload.api.url, payload.api.key)
        }
	},
	
	createStaticContent() {
		var newsDiv = document.createElement("div");
		newsDiv.setAttribute("id", "news-content-div");
		newsDiv.setAttribute("class", this.config.lastAction);
		
		if (this.config.contentIndex === 0 || this.config.contentIndex === 1) {
			newsDiv.innerHTML = this.getIntro(this.config.contentIndex);
		} else if (this.config.contentIndex === 2) {
			newsDiv.innerHTML = this.getImage("1.jpg");
		} else if (this.config.contentIndex === 3) {
			newsDiv.innerHTML = this.getImage("2.jpg");
		} else if (this.config.contentIndex === 4) {
			newsDiv.innerHTML = this.getImage("dshop speakers-01.jpg");
		} 

		return newsDiv;
	},

	getIntro(i) {
		var contentText = '';
		if (i === 0) {
			var path = this.file("/files/images/") + 'sensor.gif';
			contentText = `
			<h4>
			Get your <span class="highlight"> d-shop Vancouver</span> news, event and content on our Magic Mirror
			</h4>
			<img src="${path}" alt="image preview"/>
			`;
		} else if (i === 1) {
			contentText = `
			<span class="highlight"> D-shop's Vancouver branch </span> officially launched in May 2016! Monthly workshops are available to anyone interested and will cover various topics related to the Internet of Things (IOT), such as 3D printing, drones, and the Oculus Rift. The d-shop is SAP's pioneer makerspace for developers to meet and collaborate, to explore and learn, and, of course, to invent and build.
			</p>
			<p>
			<br>
			Do you ever get the urge to be a kid again? Here’s your chance to be one - and at work no less! Join us in experiencing and experimenting with exciting, novel technologies.
			</p>
			<br>
			<h5>
			"The mission of d-shop global program is to bring new technologies closer to all  <span class="highlight">SAP employees</span>"
			</h5>
			<br>
			`;
		}

		return contentText.trim();
	},

	getImage(fileName) {
		var path = this.file("/files/images/") + fileName;

		var contentText = `
		<h4>
		<span class="highlight"> D-shop's Vancouver branch</span>
		</h4>
		<p>Date and location: May 28th at Mako</p>
		<img src="${path}" alt="image preview" />
		`;

		return contentText.trim();
	},

});
