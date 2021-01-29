<template>
<div>
    <navbar></navbar>
    <div style="max-width: 1200px; margin: auto">
        <div class="w3-container w3-row w3-center w3-padding-32 w3-margin">
            <h1><strong>Report List</strong></h1>
        </div>

        <!-- Filter -->
        <div class="w3-container w3-center twt-filter">
            <div class="w3-bar filter-bar" >
                <input v-model="keyword" type="text" id="keyword" class="w3-input" placeholder="Search">
                <input v-model="fromDay" type="date" id="fromDay" class="w3-input" placeholder="From day">
                <input v-model="toDay" type="date" id="toDay" class="w3-input" placeholder="To day">
                <select v-model="userID" id="user" class="w3-input">
                    <option value="0">All</option>
                    <option v-for="user in users" :key="user.id" :value="user.id">{{user.name}}</option>
                </select>
                <button @click.prevent="handleFilter()" class="w3-button w3-green w3-border-red">Search</button>
                <button @click="showAddReport()" class="w3-button w3-green w3-border-red">Create</button>
            </div>
        </div>

        <!-- Show report Lists -->
        <div class="w3-container w3-center w3-responsive">
            <table class="w3-table-all">
                <tr class="w3-teal">
                    <th>#</th>
                    <th>Nội dung báo cáo</th>
                    <th>Người tạo</th>
                    <th>Ngày tạo</th>
                    <th>Ngày sửa cuối</th>
                    <th style="width: 17%">Action</th>
                </tr>
                <tr v-for="report in reports" :key="report.id">
                    <td>
                        <p>{{report.id}}</p>
                    </td>
                    <td>
                        <p>{{report.report.substring(0, 50) + '...'}}</p>
                    </td>
                    <td>
                        <p>{{report.name}}</p>
                    </td>
                    <td>
                        <p>{{report.create_at}}</p>
                    </td>
                    <td>
                        <p>{{report.modified_at}}</p>
                    </td>
                    <td>
                        <button class="w3-blue" @click="readReport(report)">Read</button>
                        <button class="w3-green" @click="showEditReport(report)">Edit</button>
                        <button class="w3-red" @click="deleteReport(report)">Delete</button>
                    </td>
                </tr>
            </table>
        </div>

        <div class="w3-container w3-row w3-center w3-bar twt-pagination">
            <ul class="pagination">
                <li  class="pagination-item">
                    <button class="w3-button" type="button"  @click="onClickPage(1)" :disabled="isInFirstPage" >First</button>
                </li>

                <li class="pagination-item">
                    <button class="w3-button" type="button" @click="onClickPage(currentPage - 1)" :disabled="isInFirstPage">Previous</button>
                </li>
                <li v-for="page in pagination" :key="page" class="pagination-item">
                    <button class="w3-button page-button" type="button" @click="onClickPage(page)" :class="{ active: isPageActive(page) }"> {{ page }}</button>
                </li>
                <li class="pagination-item">
                    <button class="w3-button" type="button" @click="onClickPage(currentPage + 1)" :disabled="isInLastPage">Next</button>
                </li>
                <li class="pagination-item">
                    <button class="w3-button" type="button" @click="onClickPage(totalPages)" :disabled="isInLastPage">Last</button>
                </li>
            </ul>
        </div>

        <div id="id01" class="w3-modal w3-xxlagre">
            <div class="w3-modal-content">
                <header class="w3-container w3-teal w3-center">
                    <span onclick="document.getElementById('id01').style.display='none'" class="w3-button w3-display-topright">&times;</span>
                    <h2 id="title-add">Add report</h2>
                    <h2 id="title-edit">Edit report</h2>
                    <h2 id="title-read">Read report</h2>
                </header>
                <div class="w3-container">
                    <form class="w3-padding-16">
                        <div id="form-input" class="w3-center w3-container">
                            <textarea v-model="reportForm" name="textarea" style="width:100%;height:150px;"></textarea>
                            <!-- <input type="text" style="width: 100%" id="contentReport"></input> -->
                        </div>
                        <div id="form-submit" class="w3-container w3-center w3-padding-16">
                            <button id="submitAddForm" @click.prevent="submitAddForm()" type="submit" class="w3-green w3-button w3-large">Submit</button>
                            <button id="submitEditForm" @click.prevent="submitEditForm()" type="submit" class="w3-green w3-button w3-large">Submit</button>
                        </div>
                        <div id="read">
                            <p>{{reportForm}}</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { reportService, userService } from './../services';
import { router } from '../router/router';
import Navbar from './Navbar';

const limit = 5;
const maxPages = 3;

export default {
    data() {
        return {
            keyword: '',
            fromDay: '',
            toDay: '',
            userID: '',
            reportForm: '',
            reports: '',
            total: 0,
            pagination: [],
            currentPage: 1,
            totalPages: 1,
            users: [],
            rp: {}
        }
    },
    components: {
        'navbar' : Navbar
    },
    computed: {
        isInFirstPage() {
        return this.currentPage === 1;
        },
        isInLastPage() {
        return this.currentPage === this.totalPages;
        }
    },
    methods: {
        handleFilter(e){
            let path = {};
            if(this.keyword != ''){
                path['search'] = this.keyword;
            }
            if(this.fromDay != ''){
                path['from'] = this.fromDay;
            }
            if(this.toDay != ''){
                path['to'] = this.toDay;
            }
            if(this.userID != '' || this.userID != 0){
                path['uid'] = this.userID;
            }
            path['page'] = 1;
        
            reportService.getReportInPagination(this.keyword, this.fromDay, this.toDay, this.userID, path['page'], limit).then(data => {
                this.currentPage = 1;
                this.reports = JSON.parse(data).data;
                console.log(this.reports);
                this.total = JSON.parse(data).total;
                console.log(this.total);
                this.pagination = [];
                this.totalPages = Math.ceil(this.total/limit);
                if(this.totalPages < 3){
                    for( var i=1; i<=this.totalPages; i++){
                        this.pagination.push(i);
                    }  
                }
                else if(this.currentPage < 3){
                        this.pagination = [1, 2, 3];
                    }
                else if(this.currentPage > this.totalPages-2){
                    this.pagination = [this.totalPages-2, this.totalPages-1, this.totalPages];
                }
                else this.pagination = [this.currentPage-1, this.currentPage, this.currentPage+1];
                
                this.$router.push({path: 'reports', query: path});
            });
        },
        onClickPage(page) {
            let path = {};
            this.currentPage = page;
            if(this.keyword != ''){
                path['search'] = this.keyword;
            }
            if(this.fromDay != ''){
                path['from'] = this.fromDay;
            }
            if(this.toDay != ''){
                path['to'] = this.toDay;
            }
            if(this.userID != '' || this.userID != 0){
                path['uid'] = this.userID;
            }
            path['page'] = page;

            reportService.getReportInPagination(this.keyword, this.fromDay, this.toDay, this.userID, path['page'], limit).then(data => {
                
                this.reports = JSON.parse(data).data;
                console.log(this.reports);
                this.total = JSON.parse(data).total;
                console.log(this.total);
                this.totalPages = Math.ceil(this.total/limit);
                this.pagination = [];
                if(this.totalPages < 3){
                    for( var i=1; i<=this.totalPages; i++){
                        this.pagination.push(i);
                    }  
                }
                else if(this.currentPage < 3){
                        this.pagination = [1, 2, 3];
                    }
                else if(this.currentPage > this.totalPages-2){
                    this.pagination = [this.totalPages-2, this.totalPages-1, this.totalPages];
                }
                else this.pagination = [this.currentPage-1, this.currentPage, this.currentPage+1];
                
                this.$router.push({path: 'reports', query: path});
            });
        },
        showAddReport(){
            document.getElementById('id01').style.display='block';
            document.getElementById('submitAddForm').style.display='block';
            document.getElementById('submitEditForm').style.display='none';
            document.getElementById('read').style.display='none';
            document.getElementById('form-input').style.display='block';
            document.getElementById('form-submit').style.display='block';
            document.getElementById('title-add').style.display='block';
            document.getElementById('title-edit').style.display='none';
            document.getElementById('title-read').style.display='none';
            this.reportForm = '';
        },
        showEditReport(report){
            document.getElementById('id01').style.display='block';
            document.getElementById('submitAddForm').style.display='none';
            document.getElementById('submitEditForm').style.display='block';
            document.getElementById('read').style.display='none';
            document.getElementById('form-input').style.display='block';
            document.getElementById('form-submit').style.display='block';
            document.getElementById('title-add').style.display='none';
            document.getElementById('title-edit').style.display='block';
            document.getElementById('title-read').style.display='none';
            this.rp = report;
            this.reportForm = report.report;
        },
        readReport(report){
            document.getElementById('id01').style.display='block';
            document.getElementById('read').style.display='block';
            document.getElementById('form-input').style.display='none';
            document.getElementById('form-submit').style.display='none';
            document.getElementById('title-add').style.display='none';
            document.getElementById('title-edit').style.display='none';
            document.getElementById('title-read').style.display='block';
            this.reportForm = report.report;
        },
        deleteReport(report){
            reportService.deleteReport(report.id).then(response => {
                console.log(response);
                let path = {};
                if(this.keyword != ''){
                    path['search'] = this.keyword;
                }
                if(this.fromDay != ''){
                    path['from'] = this.fromDay;
                }
                if(this.toDay != ''){
                    path['to'] = this.toDay;
                }
                if(this.userID != '' || this.userID != 0){
                    path['uid'] = this.userID;
                }
                path['page'] = this.currentPage;

                reportService.getReportInPagination(this.keyword, this.fromDay, this.toDay, this.userID, path['page'], limit).then(data => {
                    
                    this.reports = JSON.parse(data).data;
                    console.log(this.reports);
                    this.total = JSON.parse(data).total;
                    console.log(this.total);
                    this.totalPages = Math.ceil(this.total/limit);
                    this.pagination = [];
                    if(this.totalPages < 3){
                        for( var i=1; i<=this.totalPages; i++){
                            this.pagination.push(i);
                        }  
                    }
                    else if(this.currentPage < 3){
                        this.pagination = [1, 2, 3];
                    }
                    else if(this.currentPage > this.totalPages-2){
                        this.pagination = [this.totalPages-2, this.totalPages-1, this.totalPages];
                    }
                    else this.pagination = [this.currentPage-1, this.currentPage, this.currentPage+1];
                    
                });
                
            })
        },
        submitEditForm(){
            let report = {};     
            report['report'] = this.reportForm;
            report['uid'] = localStorage.getItem('user') || 1;   
            reportService.editReport(report,this.rp.id).then(data =>{
                console.log(data);
                document.getElementById('id01').style.display='none';
                alert('Edit successfully!!!');
                let path = {};
                if(this.keyword != ''){
                    path['search'] = this.keyword;
                }
                if(this.fromDay != ''){
                    path['from'] = this.fromDay;
                }
                if(this.toDay != ''){
                    path['to'] = this.toDay;
                }
                if(this.userID != '' || this.userID != 0){
                    path['uid'] = this.userID;
                }
                path['page'] = this.currentPage;

                reportService.getReportInPagination(this.keyword, this.fromDay, this.toDay, this.userID, path['page'], limit).then(data => {
                    
                    this.reports = JSON.parse(data).data;
                    console.log(this.reports);
                    this.total = JSON.parse(data).total;
                    console.log(this.total);
                    this.totalPages = Math.ceil(this.total/limit);
                    this.pagination = [];
                    if(this.totalPages < 3){
                        for( var i=1; i<=this.totalPages; i++){
                        this.pagination.push(i);
                    }  
                    }
                    else if(this.currentPage < 3){
                        this.pagination = [1, 2, 3];
                    }
                    else if(this.currentPage > this.totalPages-2){
                        this.pagination = [this.totalPages-2, this.totalPages-1, this.totalPages];
                    }
                    else this.pagination = [this.currentPage-1, this.currentPage, this.currentPage+1];
                   
                });
            })
            
        },
        submitAddForm(){
            let report = {};
            
            report['report'] = this.reportForm;
            report['uid'] = localStorage.getItem('user') || 1;
            reportService.createReport(report).then(response =>{
                console.log(response);
                document.getElementById('id01').style.display='none';
                alert('Create successfully!!!');
                let path = {};
                if(this.keyword != ''){
                    path['search'] = this.keyword;
                }
                if(this.fromDay != ''){
                    path['from'] = this.fromDay;
                }
                if(this.toDay != ''){
                    path['to'] = this.toDay;
                }
                if(this.userID != '' || this.userID != 0){
                    path['uid'] = this.userID;
                }
                path['page'] = this.currentPage;

                reportService.getReportInPagination(this.keyword, this.fromDay, this.toDay, this.userID, path['page'], limit).then(data => {
                    
                    this.reports = JSON.parse(data).data;
                    console.log(this.reports);
                    this.total = JSON.parse(data).total;
                    console.log(this.total);
                    this.totalPages = Math.ceil(this.total/limit);
                    this.pagination = [];
                    if(this.totalPages < 3){
                        for( var i=1; i<=this.totalPages; i++){
                        this.pagination.push(i);
                    }    
                    }
                    else if(this.currentPage < 3){
                        this.pagination = [1, 2, 3];
                    }
                    else if(this.currentPage > this.totalPages-2){
                        this.pagination = [this.totalPages-2, this.totalPages-1, this.totalPages];
                    }
                    else this.pagination = [this.currentPage-1, this.currentPage, this.currentPage+1];
                    
                });
            })
        },
        isPageActive(page) {
        return this.currentPage === page;
        }
    },
    created() {
        this.keyword = this.$route.query.search || '';
        this.currentPage = this.$route.query.page || 1;
        this.fromDay = this.$route.query.from || '';
        this.toDay = this.$route.query.to || '';
        this.userID = this.$route.query.user || '';

        reportService.getReportInPagination(this.keyword, this.fromDay, this.toDay, this.userID, this.currentPage, limit).then(data =>{
            this.reports = JSON.parse(data).data;
            this.total = JSON.parse(data).total;
            console.log(this.total);
            this.totalPages = Math.ceil(this.total/limit);
            if(this.totalPages < 3){
                for( var i=1; i<=this.totalPages; i++){
                    this.pagination.push(i);
                }   
            }
            else if(this.currentPage < 3){
                        this.pagination = [1, 2, 3];
                    }
            else if(this.currentPage > this.totalPages-2){
                this.pagination = [this.totalPages-2, this.totalPages-1, this.totalPages];
            }
            else this.pagination = [this.currentPage-1, this.currentPage, this.currentPage+1];

            this.isPageActive(this.currentPage);
        })
        console.log(1);
        userService.getAllUser().then(data => {
            this.users = JSON.parse(data);
            console.log(this.users);
        })
    }
}
</script>