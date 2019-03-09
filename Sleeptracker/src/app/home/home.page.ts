import { Component } from '@angular/core';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { ToastController } from '@ionic/angular'
import { AngularFirestore, AngularFirestoreCollection, DocumentData } from '@angular/fire/firestore';import { Observable } from 'rxjs';import { AngularFirestoreModule } from '@angular/fire/firestore';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})

export class HomePage {

	public start: Date;
	public end: Date;
	public currDate: String = new Date().toISOString();
	public overnightData: OvernightSleepData;
	public sleepinessData: StanfordSleepinessData;
	public sleepiness: Number;	

	// for cancelling/setting datetime value to default upon sending data and when cancelling out of datetime picker.
	public sleepEndTime : any;
	public sleepStartTime : any;

	public sleepTimeTitle: String = "";
	public stanfordTitle: String = "";

	public sleepString: String[] = [];	// for presenting sleep data after clicking 'view data' button
	public stanfordString: String[] = [];	// for presenting sleepiness level after clicking 'view Stanford' button

	public sleepinessText: String = " 1 - " + StanfordSleepinessData.ScaleValues[1];	// shows different range values for slider

	public sleepinessCollection:AngularFirestoreCollection;
	public sleepTimeCollection:AngularFirestoreCollection;
	public convertedDate: Date;

	constructor(public sleepService: SleepService, public toastController: ToastController, db:AngularFirestore) {
		this.sleepinessCollection = db.collection('sleepinessData');
		this.sleepTimeCollection = db.collection('sleepTimeData');
		
	}

	clearStart() {
		this.sleepStartTime = null;
	}
	clearEnd() {
		this.sleepEndTime = null;
	}

	sleepInfo(start, end) {

		this.overnightData = null;

		// checks user has completed both DateTime fields
		if (start == null || end == null) {
			this.toastController.create({
				message: "Please enter both sleep and wake times",
				duration: 2500
			}).then((tc) => {
				tc.present();
				return;
			});
		}

		// get the dates from user input - substring removes 'Z' at end of String.
		this.start = new Date(start.substring(0, start.length - 1));
		this.end = new Date(end.substring(0, start.length - 1));

		//this.addSleepinessData();

		// create new sleep data to log
		this.overnightData = new OvernightSleepData(this.start, this.end);

		// log sleep data 
		this.sleepService.logOvernightData(this.overnightData);

		// controller to notify user what is being logged
		this.toastController.create({
			message: 'Successfully logged sleep times. ' + this.overnightData.summaryString(),
			duration: 4000
		}).then((tc) => {
			tc.present();
		});

		// resets datetime fields to default upon sending info
		this.clearEnd();
		this.clearStart();

		this.addSleepTimeData();
		this.hideInfo();

	}

	sendSleepiness(sleepiness){
		
		this.sleepinessData = null;

		this.sleepinessData = new StanfordSleepinessData(sleepiness);
		this.sleepService.logSleepinessData(this.sleepinessData);

		if (sleepiness == null) {
			this.toastController.create({
				message: "Please enter a sleepiness value.",
				duration: 2500
			}).then((tc) => {
				tc.present();
				return;
			});
		}

		this.toastController.create({
			message: 'Successfully logged your Sleepiness Level = ' + this.sleepiness,
			duration: 4000
		}).then((tc) => {
			tc.present();
		});

		this.addSleepinessData();
		this.hideInfo();

		this.sleepiness = 1;
	}

	// called upon clicking 'view data' button. 
	// Presents summary string and logged time of all overnight data.
	displaySleepTime() {
		
		this.sleepTimeTitle = "Sleep Time Data: ";
		this.stanfordString = [];

		this.sleepString = [];
		
		this.sleepTimeCollection.valueChanges().subscribe((array) => {
			//console.log(array.length);
			for (var j = 0; j < array.length; j++){
				//this.convertedDate = new Date(array[j].logTime.seconds * 1000);
				this.sleepString.push(array[j].sleepTimeString);
			}
		});
		
		/*
		for (var i = 0; i < SleepService.AllOvernightData.length; i++) {
			this.sleepString.push(SleepService.AllOvernightData[i].summaryString() +  " Logged at: " + SleepService.AllOvernightData[i].loggedAt);
		}

		*/
		return this.sleepString;
	}

	displayStanford(){
		
		this.sleepTimeTitle = "Stanford Sleepiness Data: ";
		this.sleepString = [];

		this.stanfordString = [];

		this.sleepinessCollection.valueChanges().subscribe((array) => {
			//console.log(array.length);
			for (var j = 0; j < array.length; j++){
				this.convertedDate = new Date(array[j].logTime.seconds * 1000);
				this.sleepString.push("Sleepiness Value: " + array[j].sleepinessValue + ". Logged at: " + this.convertedDate);
			}
		});

		/*
		for (var i = 0; i < SleepService.AllSleepinessData.length; i++) {
			this.sleepString.push(SleepService.AllSleepinessData[i].summaryString() +  ". Logged at: " + SleepService.AllSleepinessData[i].loggedAt);
		} */
		return this.stanfordString;
		
	}

	hideInfo(){
		this.stanfordString = [];
		this.sleepString = [];
		this.sleepTimeTitle = "";
		this.stanfordTitle = "";
	}

	// Displays current slider/range value
	changeSliderInfo(sleepiness) {
		this.sleepinessText = sleepiness + " - " + StanfordSleepinessData.ScaleValues[sleepiness];
	}

	addSleepTimeData(){
		var sleepTimeObj = {'sleepTimeString': SleepService.AllOvernightData[(SleepService.AllOvernightData.length)-1].summaryString() + ". Logged At: " + SleepService.AllOvernightData[(SleepService.AllOvernightData.length)-1].loggedAt};

		this.sleepTimeCollection.add(sleepTimeObj).then((reference) => {
			 console.log("Reference to added data, kind of like a URL");
			 console.log(reference);
		});
	}

	addSleepinessData(){

		var testObj = {'sleepinessValue': this.sleepiness, 'logTime': SleepService.AllSleepData[(SleepService.AllSleepData.length) - 1].loggedAt};
		
		this.sleepinessCollection.add(testObj).then((reference) => {
			 console.log("Reference to added data, kind of like a URL");
			 console.log(reference);
		});

		this.hideInfo();
	}

	ngOnInit() {
		console.log(this.allSleepData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}

}

