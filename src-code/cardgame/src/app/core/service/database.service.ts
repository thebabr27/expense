import { Injectable } from '@angular/core';
import { Database, ref, set, get, child, onValue, push } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private db: Database) {}

  // Scrittura di dati
  writeData(path: string, data: any): Promise<void> {
    const dbRef = ref(this.db, path);
    return set(dbRef, data);
  }
  
  async pushData(path: string, data: any): Promise<void> { 
    const newRef = push(ref(this.db, path));
    await set(newRef, data);
  }

  // Lettura una tantum
  async readData<T>(path: string): Promise<T | null> {
    const dbRef = ref(this.db);
    const snapshot = await get(child(dbRef, path));
    return snapshot.exists() ? (snapshot.val() as T) : null;
  }

  // Ascolto in tempo reale
  listenToData<T>(path: string): Observable<T | null> {
    return new Observable<T | null>(subscriber => {
      const dbRef = ref(this.db, path);
      const unsubscribe = onValue(dbRef, snapshot => {
        subscriber.next(snapshot.exists() ? (snapshot.val() as T) : null);
      }, error => {
        subscriber.error(error);
      });

      // cleanup
      return () => unsubscribe();
    });
  }
}
