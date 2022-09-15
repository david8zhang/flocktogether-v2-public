import firebaseApp from './firebase'

interface Traveler {
  userId: string
  location: any
  name: string
  isPlanner: boolean
}

export class TripHandler {
  private tripId: string
  private ref: firebase.database.Reference
  constructor(tripId: string) {
    this.tripId = tripId
    this.ref = firebaseApp.database().ref('trips')
  }

  public createTrip(newTrip: any): Promise<void> {
    return this.ref.child(this.tripId).update({
      tripId: this.tripId,
      ...newTrip,
    })
  }

  public getTrip(): Promise<any> {
    return this.ref
      .child(this.tripId)
      .once('value')
      .then((res) => {
        return res.val()
      })
  }

  public addTraveler(traveler: Traveler): Promise<any> {
    return this.ref.child(`${this.tripId}/travelGroup`).update({
      [traveler.userId]: traveler,
    })
  }

  public setDateRange(dateRange: any): Promise<void> {
    return this.ref.child(this.tripId).update({
      dateRange,
    })
  }

  public setDatePollOptions(datePollOptions: any[]): Promise<void> {
    return this.ref.child(this.tripId).update({
      datePollOptions,
    })
  }

  public openDatePoll(): Promise<void> {
    return this.ref.child(this.tripId).update({
      dateRange: null,
      isDatePolling: true,
    })
  }

  public closeDatePoll(): Promise<void> {
    return this.ref.child(this.tripId).update({
      datePollOptions: null,
      isDatePolling: false,
    })
  }

  public openDestPoll(): Promise<void> {
    return this.ref.child(this.tripId).update({
      destination: null,
      isDestPolling: true,
    })
  }

  public closeDestPoll(): Promise<void> {
    return this.ref.child(this.tripId).update({
      isDestPolling: false,
    })
  }

  public setDestination(destination: any): Promise<void> {
    return this.ref.child(this.tripId).update({
      destOptions: null,
      destination,
    })
  }

  public setDestOptions(destOptions: any[]): Promise<void> {
    return this.ref.child(this.tripId).update({
      destOptions,
    })
  }
}
