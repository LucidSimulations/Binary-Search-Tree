var i_input,b_ins,b_del,b_ser,b_clr,b_pstep,b_nstep;
var count_nodes,key,totnods;
var disparr,mainarr,delarr,innerrad,outerrad,levels;
var msg=[],msgflag,next,nexttot;
var highlight=[],msghl=[];
var bkcol='#b3d9ff',nodcol='#0080ff';
var treelimit,deleteflag,simulation,indel;

msg[0]='';
msg[1]='INVALID INPUT';
msg[2]='NODE INSERTED';
msg[3]='NODE ALREADY PRESENT';
msg[4]='NODE DELETED';
msg[5]='NODE IS PRESENT';
msg[6]='NODE IS ABSENT';
msg[7]='TREE LIMIT REACHED';


function setup(){
	 var mycv=createCanvas(window.innerWidth,window.innerHeight-80);
  	mycv.parent('sketch-holder');

  	i_input = createInput();
  	i_input.position(20, 160);

  	b_ins = createButton('INSERT');
  	b_ins.position(i_input.x + i_input.width, i_input.y);
  	b_ins.mousePressed(f_ins);

  	b_del = createButton('DELETE');
  	b_del.position(b_ins.x + b_ins.width, i_input.y);
  	b_del.mousePressed(f_del);

  	b_ser = createButton('SEARCH');
  	b_ser.position(b_del.x + b_del.width, i_input.y);
  	b_ser.mousePressed(f_ser);

  	b_clr = createButton('CLEAR');
  	b_clr.position(b_ser.x + b_ser.width, i_input.y);
  	b_clr.mousePressed(f_clr);

  	b_pstep = createButton('STEP BACK');
  	b_pstep.position(b_clr.x + b_clr.width, i_input.y);
  	b_pstep.mousePressed(f_pstep);

    b_nstep = createButton('NEXT STEP');
    b_nstep.position(b_pstep.x + b_pstep.width, i_input.y);
    b_nstep.mousePressed(f_nstep);

	reset();
}

function draw(){
	background(bkcol);

  fill(0);
  textSize(35);
  textStyle(BOLD);
  textAlign(CENTER,CENTER);
  text('BINARY SEARCH TREE',window.innerWidth/2,37);

  //test message
  if(!simulation){
    fill('#021b35');
    noStroke();
    textSize(24);
    textStyle(BOLD);
    textAlign(LEFT,CENTER);
    text(msg[msgflag],22,130);
  }

  //no nodes, arr check before deletion
  if(count_nodes==0&&disparr[0][0]==undefined){
    disablebuttons();
    b_ins.removeAttribute('disabled');
  }

  for(var i=0;i<totnods;i++){
    //no nodes
    if(mainarr[0]==undefined&&disparr[0][0]==undefined){
      break;
    }
    else{
      //key==arr[i][0] so that deleted node does not disappears
      if(mainarr[i]!=undefined||key==disparr[i][0]||disparr[i][0]!=undefined){
        var l=2*i+1,r=2*i+2;
        if(next==nexttot||!simulation){          
          copyarr();
          enablebuttons();
          simulation=false;
          clearhl();
          if(indel){cleardelarr();}
          next=0;
          nexttot=0;
          indel=false;
        }

        //if deletion in progress
        if(indel){
          if(delarr[next][0]!=undefined){
            copydispdel(next);
          }
        }

        stroke('#5c6f82');
        strokeWeight(4);
        if(l<totnods&&disparr[l][0]!=undefined&&l<totnods){
          line(disparr[i][1],disparr[i][2],disparr[l][1],disparr[l][2]);
        }
        if(r<totnods&&disparr[r][0]!=undefined&&r<totnods){
          line(disparr[i][1],disparr[i][2],disparr[r][1],disparr[r][2]);
        }

        noStroke();
        //highlight
        if(disparr[i][0]==highlight[next]){
          fill(12,23,45);
          ellipse(disparr[i][1],disparr[i][2],outerrad,outerrad);
        }

        if(disparr[i][0]!=undefined){
          fill(nodcol);
          ellipse(disparr[i][1],disparr[i][2],innerrad,innerrad);
        }

        fill(255);
        textStyle(NORMAL);
        textSize(18);
        
        try{
          textAlign(CENTER,CENTER);
          text(disparr[i][0],disparr[i][1],disparr[i][2]);
          if(msghl[next]!=undefined)
            fill(0);
            textAlign(LEFT,CENTER);
            text(msghl[next],b_nstep.x+100,85);
        }
        catch(Exception){}
      }

    }
  }
}

function f_ins(){
  key=i_input.value().replace(/\s+/g,"");
  i_input.value(''); 
  clearhl();
  next=0;

  if(isFinite(key)&&key!=''&&key.length<=5){
    disablebuttons();
    simulation=true;
    key=float(key);

    copyarr();
    next=0;
    var dup=false;

    for(var i=0;i<totnods&&mainarr[i]!=undefined;){
      highlight[next]=mainarr[i];
      if(key>mainarr[i]){
        msghl[next++]=key+' > '+mainarr[i]+' , GO RIGHT';
        i=2*i+2;
      }
      else if(key<mainarr[i]){
        msghl[next++]=key+' < '+mainarr[i]+' , GO LEFT';
        i=2*i+1;
      }
      else if(key==mainarr[i]){
        dup=true;
        highlight[next++]=mainarr[i];
        msgflag=3;//node already present
        break;
      }
      if(i>=totnods){
        treelimit=true;
        msghl[next-1]='';
      }
    }

    if(treelimit){
      msgflag=7;//tree limit reached
      treelimit=false;
    }
    else if(!dup){
      mainarr[i]=key;
      highlight[next++]=mainarr[i];
      msgflag=2;//node inserted
      count_nodes++;
    }

    nexttot=next-1;
    console.log('nexttot: '+nexttot);
    next=0;
  }
  else{
    msgflag=1;//invalid input
  }
}

function f_ser(){
  key=i_input.value().replace(/\s+/g,"");
  i_input.value('');
  clearhl();
  next=0;

  if(isFinite(key)&&key!=''&&key.length<=5){
    key=float(key);
    simulation=true;
    disablebuttons();

    var i=0;
    while(key!=mainarr[i]&&i<totnods){
      highlight[next]=mainarr[i];
      if(mainarr[i]==undefined)
        break;
      else if(key>mainarr[i]){
        msghl[next++]=key+' > '+mainarr[i]+' , GO RIGHT';
        i=2*i+2;
      }
      else if(key<mainarr[i]){
        msghl[next++]=key+' < '+mainarr[i]+' , GO LEFT';
        i=2*i+1;
      }
      if(i>=totnods){
        treelimit=true;
        break;
      }
    }
    //node is present
    if(!treelimit&&mainarr[i]==key){
      highlight[next++]=mainarr[i];
      msgflag=5//
    }
    else{
      msgflag=6;//node is absent
      treelimit=false;
    }
    nexttot=next;
    next=0;
  }
  else{
    msgflag=1;//invalid input  
  }
}

function f_del(){
  key=i_input.value().replace(/\s+/g,"");
  i_input.value('');
  clearhl();
  next=0;

  if(isFinite(key)&&key!=''&&key.length<=5){
    key=float(key);
    disablebuttons();
    simulation=true;
    indel=true;
    //copydelarr(0);
    copyarr();

    del(key);

    if(deleteflag){
      count_nodes--;
      msgflag=4;
    }
    else{
      msgflag=6;//node is absent
    }
    nexttot=next;
    next=0;
    deleteflag=false;
    showarr();
  }
  else{
    msgflag=1;//invalid input
  }
}

function del(val){
  var i=0,lc,rc,present=false;
  while(i<totnods){
    highlight[next]=mainarr[i];
    if(mainarr[i]==undefined){
      present=false;
      break;
    }
    if(mainarr[i]==val){
      msghl[next++]='NODE IS PRESENT';
      present=true;
      break
    }
    if(val>mainarr[i]){
      msghl[next++]=val+' > '+mainarr[i]+' , GO RIGHT';
      i=2*i+2;
    }
    else if(val<mainarr[i]){
      msghl[next++]=val+' < '+mainarr[i]+' , GO LEFT';
      i=2*i+1;
    }
  }
  if(present){
    deleteflag=true;//node needs to be deleted
    lc=2*i+1;
    rc=2*i+2;
    //no child
    if((lc>totnods||rc>totnods)||(lc<totnods&&mainarr[lc]==undefined&&rc<totnods&&mainarr[rc]==undefined)){
      highlight[next]=mainarr[i];
      msghl[next++]='NO CHILDREN, SO DELETE '+mainarr[i];
      copydelarr(next);
      mainarr[i]=undefined;
    }
    //else right child
    else if(rc<totnods&&mainarr[rc]!=undefined){
      highlight[next]=mainarr[i];
      msghl[next++]='HAS RIGHT CHILD, REPLACE '+mainarr[i]+' WITH ITS INORDER SUCCESSOR';
      var ll=2*rc+1;
      //find min from rigth sub-tree
      if(ll<totnods&&mainarr[ll]!=undefined){
        var pr=ll,lll=2*ll+1;
        while(lll<totnods&&mainarr[lll]!=undefined){
          pr=lll;
          lll=2*lll+1;
        }
        highlight[next]=mainarr[pr];
        msghl[next++]='INORDER SUCCESSOR: '+mainarr[pr]+' , SO DELETE IT';
        var temp=mainarr[pr];
        copydelarr(next);
        del(mainarr[pr]);
        mainarr[i]=temp;
        highlight[next]=highlight[next];
        msghl[next++]='REPLACE '+val+' WITH '+temp;
        copydelarr(next);
      }
      //shift left subtree
      else if((2*rc+2)<totnods&&(mainarr[2+rc+2]!=undefined)){
        highlight[next]=mainarr[rc];
        msghl[next++]='INORDER SUCCESSOR: '+mainarr[rc]+' , SO DELETE IT';
        var temp=mainarr[rc];
        copydelarr(next);
        del(mainarr[rc]);
        mainarr[i]=temp;
        highlight[next]=highlight[next];
        msghl[next++]='REPLACE '+val+' WITH '+temp;
        copydelarr(next);
      }
      else{
        //no child
        highlight[next]=mainarr[rc];
        msghl[next++]='INORDER SUCCESSOR: '+mainarr[rc]+' , SO DELETE IT';
        var temp=mainarr[rc];
        copydelarr(next);
        del(mainarr[rc]);
        mainarr[i]=temp;
        highlight[next]=highlight[next];
        msghl[next++]='REPLACE '+val+' WITH '+temp;
        copydelarr(next);
      }
    }
    //left child present
    else{
      highlight[next]=mainarr[i];
      msghl[next++]='NO RIGHT CHILD, REPLACE '+mainarr[i]+' WITH ITS INORDER PREDECESSOR';
      var rr=2*lc+2;
      //find max from right sub-tree
      if(rr<totnods&&mainarr[rr]!=undefined){
        var pr=rr,rrr=2*rr+2;
        while(rrr<totnods&&mainarr[rrr]!=undefined){
          pr=rrr;
          rrr=2*rrr+2;
        }
        highlight[next]=mainarr[i];
        msghl[next++]='INORDER SUCCESSOR: '+mainarr[pr]+' , SO DELETE IT';
        var temp=mainarr[pr];
        copydelarr(next);
        del(mainarr[pr]);
        mainarr[i]=temp;
        highlight[next]=highlight[next];
        msghl[next++]='REPLACE '+val+' WITH '+temp;
        copydelarr(next);
      }
      //shift left sub-tree
      else if((2*lc+1)<totnods&&(mainarr[2+lc+1]!=undefined)){
        highlight[next]=mainarr[lc];
        msghl[next++]='INORDER SUCCESSOR: '+mainarr[lc]+' , SO DELETE IT';
        var temp=mainarr[lc];
        copydelarr(next);
        del(mainarr[lc]);
        mainarr[i]=temp;
        highlight[next]=highlight[next];
        msghl[next++]='REPLACE '+val+' WITH '+temp;
        copydelarr(next);
      }
      //no children
      else{
        highlight[next]=mainarr[lc];
        msghl[next++]='INORDER SUCCESSOR: '+mainarr[lc]+' , SO DELETE IT';
        var temp=mainarr[lc];
        copydelarr(next);
        del(mainarr[lc]);
        mainarr[i]=temp;
        highlight[next]=highlight[next];
        msghl[next++]='REPLACE '+val+' WITH '+temp;
        copydelarr(next);
      }
    }
  }
  else{//absent
    deleteflag=false;//no nodes were deleted
  }
}

function f_clr(){
  reset();
}

function f_nstep(){
  next++;
  if(next>=nexttot)
    next=nexttot;
  console.log('next: '+next);
}

function f_pstep(){
  next--;
  if(next==-1)
    next=0;
  console.log('next: '+next);
}

function copyarr(){
  for(var i=0;i<totnods;i++)
    disparr[i][0]=mainarr[i];
}

function copydelarr(n){
  for(var i=0;i<totnods;i++)
    delarr[n][i]=mainarr[i];  
}

function copydispdel(n){
  for(var i=0;i<totnods;i++)
    disparr[i][0]=delarr[n][i];   
}

function showarr(){
  //console.log(mainarr);
  //console.log(disparr);
  //console.log(highlight);
  //console.log(msghl);
  //console.log(delarr);
}

function dispdisp(){
  console.log(disparr);
}

function clearhl(){
  for(var i=0;i<totnods;i++){
    highlight[i]=undefined;
    msghl[i]=undefined;
  }
}

function cleardelarr(){
  for(var i=0;i<totnods;i++){
    delarr[i*4]=[];
    delarr[i*4+1]=[];
    delarr[i*4+2]=[];
    delarr[i*4+3]=[];
  }
}

function setposition(){
	var www=window.innerWidth,i,j,k=0;

  	for(i=0;i<levels;i++){
    	cnt=Math.pow(2,i);
    	var l=1;
    	for(j=0;j<cnt;j++){
      	disparr[k][2]=(i+1)*100+40;

      	if(j<cnt/2){
        	disparr[k][1]=(www/Math.pow(2,i+1))*l;
      	} 
      	else{
        	disparr[k][1]=(www/Math.pow(2,i+1))*l;
      	}
      	k++; 
      	l=l+2;
    }
  }
}

function enablebuttons(){
  b_ins.removeAttribute('disabled');
  b_ser.removeAttribute('disabled');
  b_del.removeAttribute('disabled');
}

function disablebuttons(){
  b_ins.attribute('disabled','');
  b_ser.attribute('disabled','');
  b_del.attribute('disabled','');
}

function reset(){
	count_nodes=0;
	totnods=63;
	innerrad=40;
	outerrad=52;
	levels=6;
	disparr=[];
	mainarr=[];
  delarr=[];
	msgflag=0;
	next=0;
	nexttot=0;
	treelimit=false;
	simulation=false;
  deleteflag=false;
  nextstep=0;
  nexttot=0;
  indel=false;

	for(var i=0;i<totnods;i++){
    	disparr[i]=[];
      delarr[i*4]=[];
      delarr[i*4+1]=[];
      delarr[i*4+2]=[];
      delarr[i*4+3]=[];
  }

  setposition();

  i_input.value('');
  enablebuttons();
}