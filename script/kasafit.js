function kasafit(data) {
    var n = data.length;

    /* Compute the means */
    var x_sum = 0;
    var y_sum = 0;
    for(var i=0; i<n; i++)
    {
        x_sum += data['points'][i].x;
        y_sum += data['points'][i].y;
    }
    var x_mean = x_sum/n;
    var y_mean = y_sum/n;
    console.log(x_mean);
    console.log(y_mean);

    /* Compute the moments */
    var m_xx = 0;
    var m_yy = 0;
    var m_xy = 0;
    var m_xz = 0;
    var m_yz = 0;

    for (i=0; i<data.length; i++)
    {
        var pt = data['points'][i];
        var x_i = pt.x - x_mean;   //  centered x-coordinates
        var y_i = pt.y - y_mean;   //  centered y-coordinates
        var z_i = x_i*x_i + y_i*y_i;

        m_xx += x_i*x_i;
        m_yy += y_i*y_i;
        m_xy += x_i*y_i;
        m_xz += x_i*z_i;
        m_yz += y_i*z_i;
    }

    m_xx /= data.length;
    m_yy /= data.length;
    m_xy /= data.length;
    m_xz /= data.length;
    m_yz /= data.length;

    //    solving system of equations by Cholesky factorization
    var G11 = Math.sqrt(m_xx);
    var G12 = m_xy/G11;
    var G22 = Math.sqrt(m_yy - G12*G12);

    var D1 = m_xz/G11;
    var D2 = (m_yz - D1*G12)/G22;

    //    computing paramters of the fitting circle
    var C = D2/G22/2;
    var B = (D1 - G12*C)/G11/2;

    //       assembling the output
    var circle = new Object();
    circle.a = B + x_mean;
    circle.b = C + y_mean;
    circle.r = Math.sqrt(B*B + C*C + m_xx + m_yy);
    //circle.s = Sigma(data,circle);
    circle.i = 0;
    circle.j = 0;

    return circle;
}


function generate_data() {
    var data = {
        'points' : [],
        'length' : 0
    };

    function point(x, y) {
        this.x = x;
        this.y = y;
    }

    var r = 80;
    var center_x = 256;
    var center_y = 256;
    
    var num_of_points = 50;
   
    for (var i=0; i<num_of_points; ) {
        var x = Math.floor(Math.random() * 512);
        var y_minus_center_y_sq = (r*r) - ((x-center_x) * (x-center_x));
        if(y_minus_center_y_sq < 0){
            continue;
        }
        var y = Math.sqrt(y_minus_center_y_sq) + center_y;
        i++;

        var noisy_x = x + Math.random() * 20;
        var noisy_y = y + Math.random() * 20;
        data['points'].push(new point(noisy_x, noisy_y));
        data['length'] = i;        
    }

    for (var i=0; i<num_of_points; ) {
        var x = Math.floor(Math.random() * 512);
        var y_minus_center_y_sq = (r*r) - ((x-center_x) * (x-center_x));
        if(y_minus_center_y_sq < 0){
            continue;
        }
        var y = -Math.sqrt(y_minus_center_y_sq) + center_y;
        i++;

        var noisy_x = x + Math.random() * 20;
        var noisy_y = y + Math.random() * 20;
        data['points'].push(new point(noisy_x, noisy_y));
        data['length'] = i+50;        
    }

    return data;
}

function plot_points(data) {
    var ctx = document.getElementById("kasafit-demo-canvas").getContext("2d");
    ctx.fillStyle = "#ff2626";
    for (var i=0; i<data.length; i++){
        var pt = data['points'][i];
        var x = pt.x;
        var y = pt.y;
        ctx.beginPath();
        ctx.arc(x,y, 2, 0, Math.PI * 2, true);
        ctx.fill();
    }    
}

var data_pts = generate_data();
plot_points(data_pts);

function on_reset() {
    var ctx = document.getElementById("kasafit-demo-canvas").getContext("2d");
    ctx.clearRect(0, 0, 512, 512);
    data_pts = generate_data();
    plot_points(data_pts);
}

function on_run(){
    var circle = kasafit(data_pts);
    console.log(circle);
    var ctx = document.getElementById("kasafit-demo-canvas").getContext("2d");
    
    ctx.strokeStyle = "#2626ff";
    ctx.beginPath();
    ctx.arc(circle.a,circle.b, circle.r, 0, Math.PI * 2, true);
    ctx.stroke();
}