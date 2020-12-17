import { CinemaService } from './../services/cinema.service';
//import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
//import { error } from 'console';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes; 
  public cinemas;
  public currentVille;
  public currentCinema;
  private salles;
  private currentProjection: any;
  private selectedTickets: any;



  constructor(public CinemaService:CinemaService ) { }

  ngOnInit() {
    this.CinemaService.getVilles()
       .subscribe(data=>{
          this.villes=data;
       },err=>{
         console.log(err);

       })

  }

  onGetCinemas(v) {
    this.currentVille=v;
    this.salles=undefined;
    this.CinemaService.getCinemas(v)
    .subscribe(data=>{
      this.cinemas=data;
   },err=>{
     console.log(err);

   })
  }
  onGetSalles(c) {
    this.currentCinema=c;
    this.CinemaService.getSalles(c)
    .subscribe(data=>{
      this.salles=data;
      this.salles._embedded.salles.forEach(salle=>{
        this.CinemaService.getProjections(salle)
        .subscribe(data=>{
          salle.projections=data;
       },err=>{
         console.log(err);

       })
      })
   },err=>{
     console.log(err);

   })
  }

  onGetTicketsPlaces(p) {
    this.currentProjection=p;
    this.CinemaService.getTicketsPlaces(p)
    .subscribe(data=>{
     this.currentProjection.tickets=data;
     this.selectedTickets=[];
   },err=>{
     console.log(err);

   })
  }

  onSelectTicket(t) {
   if(!t.selected){
     t.selected=true;
     this.selectedTickets.push(t);
   }
   else{
    t.selected=false;
    this.selectedTickets.splice( this.selectedTickets.indexOf(t),1);
   }
   console.log(this.selectedTickets);

  }

  getTicketClass(t) {
    let str="btn ticket "; 
    if(t.reservee==true){
      str+="btn-danger";
    }
    else if(t.selected) {
      str+="btn-warning"
    }
    else{
      str+="btn-success"
    }
    return str;
  }

  onPayTickets(dataForm){
    let tickets=[];
    this.selectedTickets.forEach(t=>{
      tickets.push(t.id); 
    });
    dataForm.tickets=tickets;
   this.CinemaService.payerTickets(dataForm)
   .subscribe(data=>{
      alert("Ticket Réservé avec succès!")
      this.onGetTicketsPlaces(this.currentProjection);
  },err=>{
    console.log(err);

  })
  }

}
