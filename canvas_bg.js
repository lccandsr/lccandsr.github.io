$(document).ready(function(){
    var canvas=document.getElementById("c");
    var ctx=canvas.getContext("2d");
    var c=$("#c");
    var w,h;
    var pi=Math.PI;
    var all_attribute={
        num:60,
        start_probability:0.08,
        size_min:0.8,
        size_max:1.5,
        size_add_min:0.2,
        size_add_max:0.4,
        opacity_min:0.2,
        opacity_max:0.4,
        opacity_prev_min:.003,
        opacity_prev_max:.005,
        light_min:10,
        light_max:80,
    };
    var style_color=find_random(0,360);
    var all_element=[];
    
    // ========== 关键修改1：自定义高度配置 ==========
    // 方式1：固定加高（比如在窗口高度基础上加500px）
    var heightExtra = 300; // 可自行调整加高的数值，比如300、800
    // 方式2：比例放大（比如窗口高度的1.5倍）
    // var heightScale = 1.5; // 1.2=20%增高，2=翻倍
    
    window_resize();
    
    function start(){
        window.requestAnimationFrame(start);
        style_color+=0.1;
        ctx.fillStyle='hsl('+style_color+',100%,97%)';
        ctx.fillRect(0,0,w,h);
        if(all_element.length<all_attribute.num&&Math.random()<all_attribute.start_probability){
            all_element.push(new ready_run);
        }
        all_element.map(function(line){
            line.to_step();
        })
    }
    
    function ready_run(){
        this.to_reset();
    }
    
    function arc_heart(x,y,z,m){
        y-=m*10;
        ctx.moveTo(x,y);
        z*=0.05;
        ctx.bezierCurveTo(x,y-3*z,x-5*z,y-15*z,x-25*z,y-15*z);
        ctx.bezierCurveTo(x-55*z,y-15*z,x-55*z,y+22.5*z,x-55*z,y+22.5*z);
        ctx.bezierCurveTo(x-55*z,y+40*z,x-35*z,y+62*z,x,y+80*z);
        ctx.bezierCurveTo(x+35*z,y+62*z,x+55*z,y+40*z,x+55*z,y+22.5*z);
        ctx.bezierCurveTo(x+55*z,y+22.5*z,x+55*z,y-15*z,x+25*z,y-15*z);
        ctx.bezierCurveTo(x+10*z,y-15*z,x,y-3*z,x,y);
    }
    
    ready_run.prototype={
        to_reset:function(){
            var t=this;
            t.x=find_random(0,w);
            t.y=find_random(0,h); // 粒子Y坐标随加高后的画布范围随机
            t.size=find_random(all_attribute.size_min,all_attribute.size_max);
            t.size_change=find_random(all_attribute.size_add_min,all_attribute.size_add_max);
            t.opacity=find_random(all_attribute.opacity_min,all_attribute.opacity_max);
            t.opacity_change=find_random(all_attribute.opacity_prev_min,all_attribute.opacity_prev_max);
            t.light=find_random(all_attribute.light_min,all_attribute.light_max);
            t.color='hsl('+style_color+',100%,'+t.light+'%)';
        },
        to_step:function(){
            var t=this;
            t.opacity-=t.opacity_change;
            t.size+=t.size_change;
            if(t.opacity<=0){
                t.to_reset();
                return false;
            }
            ctx.fillStyle=t.color;
            ctx.globalAlpha=t.opacity;
            ctx.beginPath();
            arc_heart(t.x,t.y,t.size,t.size);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha=1;
        }
    }
    
    // ========== 关键修改2：调整窗口适配函数 ==========
    function window_resize(){
        w=window.innerWidth; // 宽度保持窗口宽度不变
        // 方式1：固定加高（推荐，效果可控）
        h=window.innerHeight + heightExtra; 
        // 方式2：比例放大（取消注释即可用）
        // h=window.innerHeight * heightScale;
        
        canvas.width=w;
        canvas.height=h;
    }
    
    $(window).resize(function(){
        window_resize();
    });
    
    function find_random(num_one,num_two){
        return Math.random()*(num_two-num_one)+num_one;
    }
    
    start();
});